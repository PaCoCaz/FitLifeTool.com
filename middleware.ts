import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isLoggedIn = !!session;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";

  // ❌ Niet ingelogd → protected routes blokkeren
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ✅ Ingelogd → login en home overslaan
  if (isLoggedIn && (isLoginPage || isHomePage)) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/settings/:path*"],
};
