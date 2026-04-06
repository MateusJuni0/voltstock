import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Schema ──────────────────────────────────────────────────────────────────

const createReviewSchema = z.object({
  product_id: z.number().int().positive("ID de produto invalido"),
  rating: z.number().int().min(1, "Minimo 1 estrela").max(5, "Maximo 5 estrelas"),
  title: z
    .string()
    .min(3, "Titulo deve ter pelo menos 3 caracteres")
    .max(120, "Titulo demasiado longo (max. 120 caracteres)"),
  body: z
    .string()
    .min(10, "Avaliacao deve ter pelo menos 10 caracteres")
    .max(2000, "Avaliacao demasiado longa (max. 2000 caracteres)"),
});

// ── Rate limiter ────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 3600_000; // 1 hour
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Response helpers ────────────────────────────────────────────────────────

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

// ── Helper: create authenticated Supabase client for route handlers ─────────

async function createRouteSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}

// ── GET: fetch approved reviews for a product ───────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(request.url);
  const productIdRaw = searchParams.get("product_id");

  if (!productIdRaw) {
    return errorResponse("Parametro product_id e obrigatorio.", 400);
  }

  const productId = parseInt(productIdRaw, 10);

  if (Number.isNaN(productId) || productId <= 0) {
    return errorResponse("product_id invalido.", 400);
  }

  try {
    const supabase = await createRouteSupabase();

    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, author_name, rating, title, body, is_verified_purchase, created_at")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return successResponse(data ?? []);
  } catch {
    return errorResponse("Erro ao carregar avaliacoes.", 500);
  }
}

// ── POST: submit a new review (requires auth) ──────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return errorResponse("Demasiados pedidos. Tente novamente mais tarde.", 429);
  }

  // Parse body
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("Corpo do pedido invalido.", 400);
  }

  // Validate
  const parsed = createReviewSchema.safeParse(rawBody);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados invalidos.";
    return errorResponse(firstError, 400);
  }

  const { product_id, rating, title, body } = parsed.data;

  try {
    const supabase = await createRouteSupabase();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Tens de iniciar sessao para avaliar.", 401);
    }

    // Get author name from profile or user metadata
    let authorName = "Utilizador";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      authorName = profile.full_name;
    } else if (user.user_metadata?.full_name) {
      authorName = user.user_metadata.full_name as string;
    } else if (user.email) {
      authorName = user.email.split("@")[0] ?? "Utilizador";
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("user_id", user.id)
      .limit(1);

    if (existingReview && existingReview.length > 0) {
      return errorResponse("Ja avaliaste este produto.", 409);
    }

    // Insert review
    const { data: newReview, error: insertError } = await supabase
      .from("product_reviews")
      .insert({
        product_id,
        user_id: user.id,
        author_name: authorName,
        rating,
        title,
        body,
        is_verified_purchase: false,
        is_approved: false,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return successResponse(
      { id: newReview.id, message: "Avaliacao submetida! Sera visivel apos aprovacao." },
      201,
    );
  } catch {
    return errorResponse("Erro ao submeter avaliacao. Tenta novamente.", 500);
  }
}
