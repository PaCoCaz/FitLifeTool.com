// proxy.ts

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // nooit auth routes blokkeren
  if (pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // ✅ veilige auth check (geen refresh token error spam)
  let user = null

  try {
    const { data, error } = await supabase.auth.getUser()

    if (!error) {
      user = data.user
    }
  } catch {
    user = null
  }

  const isLoggedIn = !!user

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/handbook")

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // role check
  if (isLoggedIn && pathname.startsWith("/handbook")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["owner", "admin", "developer"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",

    "/:category",
    "/:category/:path*",

    "/dashboard/:path*",
    "/settings/:path*",
    "/handbook/:path*",
    "/auth/:path*",
  ],
}