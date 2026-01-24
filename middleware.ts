// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⛔️ NOOIT auth endpoints intercepten
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/handbook");

  // ❌ Niet ingelogd → protected routes blokkeren
  // 🔁 Redirect nu altijd naar / (niet meer naar /login)
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  // 🔒 Role-check alleen voor handbook
  if (isLoggedIn && pathname.startsWith("/handbook")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["owner", "admin", "developer"].includes(profile.role)) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  // ✅ GEEN redirects meer voor:
  // - /
  // - /login
  // - /register
  // Dit wordt nu volledig door pagina’s en header afgehandeld

  return response;
}

export const config = {
  matcher: [
    "/",                         // homepage
    "/login",
    "/forgot-password",
    "/reset-password",

    // publieke categorieën (SEO)
    "/:category",
    "/:category/:path*",

    // app routes
    "/dashboard/:path*",
    "/settings/:path*",
    "/handbook/:path*",
    "/auth/:path*",
  ],
};
