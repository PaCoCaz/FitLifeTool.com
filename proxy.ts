// proxy.ts

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import {
  isOnboardingRoute,
  isProtectedAppRoute,
  isRouteWithin,
  normalizePathnameForAuth,
  requiresProxyAuth,
  skipsProxyAuth,
} from "./app/lib/auth/proxyAuthRules"
import {
  getOnboardingStep,
  ONBOARDING_PROFILE_FIELDS,
} from "./app/lib/auth/onboardingState"
import { asAppLanguage } from "./app/lib/languagePreference"

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authorizationPathname = normalizePathnameForAuth(pathname)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)
  requestHeaders.delete("x-interface-locale")
  const requestedLanguage = asAppLanguage(
    request.nextUrl.searchParams.get("lang")
  )
  if (requestedLanguage) {
    requestHeaders.set("x-interface-locale", requestedLanguage)
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  if (
    skipsProxyAuth(pathname) ||
    pathname.startsWith("/auth") ||
    !requiresProxyAuth(pathname)
  ) {
    return response
  }

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

  const isProtected = isProtectedAppRoute(authorizationPathname)
  const isOnboarding = isOnboardingRoute(authorizationPathname)

  if (!isLoggedIn && (isProtected || isOnboarding)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isLoggedIn && user && (isProtected || isOnboarding)) {
    const [{ data: profile, error: profileError }, { data: activeGoal, error: goalError }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select(ONBOARDING_PROFILE_FIELDS)
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("user_goal_periods")
          .select("id")
          .eq("user_id", user.id)
          .is("end_at", null)
          .order("start_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

    const onboardingStep =
      profileError || goalError
        ? "profile"
        : getOnboardingStep(profile, Boolean(activeGoal))

    if (isOnboarding && onboardingStep === "complete") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (isProtected && onboardingStep !== "complete") {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  // role check
  if (
    isLoggedIn &&
    user &&
    isRouteWithin(authorizationPathname, "/handbook")
  ) {
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
    "/onboarding/:path*",
  ],
}
