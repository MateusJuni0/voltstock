import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback handler — Supabase redirects here after Google sign-in.
 * Exchanges the one-time `code` for a session and redirects the user back
 * to where they came from (or to the homepage if no `next` param is set).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    // No code param — redirect to home with an error hint
    return NextResponse.redirect(`${origin}/?error=oauth_no_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
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
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Auth exchange failed — redirect with error hint (server-side log only)
    return NextResponse.redirect(`${origin}/?error=oauth_failed`);
  }

  // Successful auth — redirect to intended destination
  return NextResponse.redirect(`${origin}${next}`);
}
