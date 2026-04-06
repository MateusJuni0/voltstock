import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ── Schema ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  nome: z.string().min(2, "Nome e obrigatorio (min. 2 caracteres)").max(100),
  email: z.string().email("Email invalido").max(254),
  assunto: z.enum(["suporte", "encomendas", "devolucoes", "parcerias", "outro"], {
    error: "Selecione um assunto valido",
  }),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000, "Mensagem demasiado longa (max. 2000 caracteres)"),
});

// ── Simple in-memory rate limiter ──────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 3600_000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 submissions per hour per IP

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

interface ApiResponse {
  success: boolean;
  error?: string;
}

function successResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({ success: true }, { status: 200 });
}

function errorResponse(message: string, status: number): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  // CSRF: verify Origin header
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  if (!origin || !appUrl.startsWith(origin)) {
    return errorResponse("Origem nao autorizada.", 403);
  }

  // Rate limiting by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return errorResponse("Demasiados pedidos. Tente novamente mais tarde.", 429);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Corpo do pedido invalido.", 400);
  }

  // Validate input
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados invalidos.";
    return errorResponse(firstError, 400);
  }

  const { nome, email, assunto, mensagem } = parsed.data;

  // Persist to Supabase
  try {
    const supabase = getSupabaseAdmin();

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: nome,
        email,
        subject: assunto,
        message: mensagem,
      });

    if (dbError) {
      throw new Error(dbError.message);
    }
  } catch {
    // Even if DB fails, we don't want to lose the message entirely.
    // In production, this would go to a dead-letter queue or alert system.
    return errorResponse(
      "Erro ao processar a sua mensagem. Por favor tente novamente mais tarde.",
      500,
    );
  }

  // Optional: forward to n8n webhook for notifications
  const n8nWebhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;

  if (n8nWebhookUrl) {
    // Fire-and-forget — don't block the response on notification delivery
    fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nome,
        email,
        subject: assunto,
        message: mensagem,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Notification failure is non-critical — message is already saved in DB
    });
  }

  return successResponse();
}
