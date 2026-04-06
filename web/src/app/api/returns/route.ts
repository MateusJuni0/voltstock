import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ── Schemas ────────────────────────────────────────────────────────────────

const createReturnSchema = z.object({
  order_id: z.string().uuid("ID de encomenda invalido"),
  reason: z
    .string()
    .min(10, "O motivo deve ter pelo menos 10 caracteres")
    .max(1000, "O motivo nao pode exceder 1000 caracteres"),
});

// ── Response helpers ───────────────────────────────────────────────────────

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

function errorResponse(message: string, status: number): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ── GET: Fetch user's return requests ──────────────────────────────────────

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Autenticacao necessaria.", 401);
  }

  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("return_requests")
    .select("id, order_id, reason, status, admin_notes, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return successResponse([]);
    }
    return errorResponse("Erro ao carregar pedidos de devolucao.", 500);
  }

  // Enrich with order numbers
  const orderIds = [...new Set((data ?? []).map((r) => r.order_id))];

  let orderMap: Record<string, string> = {};

  if (orderIds.length > 0) {
    const { data: orders } = await admin
      .from("orders")
      .select("id, order_number")
      .in("id", orderIds);

    if (orders) {
      orderMap = Object.fromEntries(orders.map((o) => [o.id, o.order_number]));
    }
  }

  const enriched = (data ?? []).map((r) => ({
    ...r,
    order_number: orderMap[r.order_id] ?? null,
  }));

  return successResponse(enriched);
}

// ── POST: Submit a return request ──────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Autenticacao necessaria.", 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Corpo do pedido invalido.", 400);
  }

  const parsed = createReturnSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados invalidos.";
    return errorResponse(firstError, 400);
  }

  const { order_id, reason } = parsed.data;
  const admin = getSupabaseAdmin();

  // Validate: order must belong to the user
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, created_at, user_id")
    .eq("id", order_id)
    .single();

  if (orderError || !order) {
    return errorResponse("Encomenda nao encontrada.", 404);
  }

  if (order.user_id !== user.id) {
    return errorResponse("Nao tem permissao para esta encomenda.", 403);
  }

  // Validate: order must be within 14 days
  const orderDate = new Date(order.created_at);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  if (orderDate < fourteenDaysAgo) {
    return errorResponse(
      "O prazo de 14 dias para devolucao ja expirou para esta encomenda.",
      400,
    );
  }

  // Check for existing pending/approved return for the same order
  const { data: existing } = await admin
    .from("return_requests")
    .select("id, status")
    .eq("order_id", order_id)
    .eq("user_id", user.id)
    .in("status", ["pending", "approved"]);

  if (existing && existing.length > 0) {
    return errorResponse(
      "Ja existe um pedido de devolucao em curso para esta encomenda.",
      409,
    );
  }

  // Create the return request
  const { data: created, error: insertError } = await admin
    .from("return_requests")
    .insert({
      order_id,
      user_id: user.id,
      reason,
      status: "pending",
    })
    .select("id, order_id, reason, status, created_at")
    .single();

  if (insertError) {
    return errorResponse("Erro ao criar pedido de devolucao.", 500);
  }

  return successResponse(created, 201);
}
