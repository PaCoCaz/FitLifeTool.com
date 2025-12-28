import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⛔️ NOOIT auth endpoints intercepten (logout, callbacks, etc.)
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ⚠️ BELANGRIJK: geen getSession(), alleen getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  const isLogin = pathname === "/login";
  const isHome = pathname === "/";
  const isResetPassword = pathname === "/reset-password";
  const isForgotPassword = pathname === "/forgot-password";

  // ❌ Niet ingelogd → protected routes blokkeren
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ✅ Ingelogd → login/home overslaan
  // ⚠️ MAAR reset/forgot password altijd toestaan
  if (
    isLoggedIn &&
    (isLogin || isHome) &&
    !isResetPassword &&
    !isForgotPassword
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
