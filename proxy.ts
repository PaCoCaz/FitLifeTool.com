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
  applyPendingAuthCookies,
  resolveServerAuthState,
  type PendingAuthCookie,
} from "./app/lib/auth/serverAuthState"
import { resolvePostLoginDestination } from "./app/lib/auth/postLoginDestination"
import {
  asAuthLocale,
  getSafeProtectedReturnTo,
} from "./app/lib/auth/authRedirects"
import {
  AUTH_CONTEXT_COOKIE,
  AUTH_CONTEXT_COOKIE_OPTIONS,
  buildSessionExpiredLoginPath,
  parseAuthContextMarker,
  serializeAuthContextMarker,
} from "./app/lib/auth/sessionLifecycle"

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
  const requestedLanguage = asAuthLocale(
    request.nextUrl.searchParams.get("lang")
  )
  // asAuthLocale delegates to the canonical asAppLanguage allowlist.
  if (requestedLanguage) {
    requestHeaders.set("x-interface-locale", requestedLanguage)
  }

  if (
    skipsProxyAuth(pathname) ||
    pathname.startsWith("/auth") ||
    !requiresProxyAuth(pathname)
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const pendingCookies: PendingAuthCookie[] = []
  const rawMarker = request.cookies.get(AUTH_CONTEXT_COOKIE)?.value
  const priorMarker = parseAuthContextMarker(rawMarker)
  let markerAction: { value: string; remove?: boolean } | null =
    rawMarker && !priorMarker ? { value: "", remove: true } : null

  const finalize = (response: NextResponse) => {
    applyPendingAuthCookies(response, pendingCookies)
    if (markerAction) {
      response.cookies.set(AUTH_CONTEXT_COOKIE, markerAction.value, {
        ...AUTH_CONTEXT_COOKIE_OPTIONS,
        ...(markerAction.remove ? { maxAge: 0 } : {}),
      })
    }
    return response
  }

  const next = () =>
    finalize(NextResponse.next({ request: { headers: requestHeaders } }))

  const redirect = (destination: string) =>
    finalize(NextResponse.redirect(new URL(destination, request.url)))

  const unavailable = () =>
    finalize(
      NextResponse.json(
        { code: "AUTH_STATE_UNAVAILABLE" },
        { status: 503 }
      )
    )

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
            request.cookies.set(name, value)
            pendingCookies.push({ name, value, options })
          })
        },
      },
    }
  )

  const isProtected = isProtectedAppRoute(authorizationPathname)
  const isOnboarding = isOnboardingRoute(authorizationPathname)
  const authState = await resolveServerAuthState(supabase)

  if (authState.kind === "RESOLUTION_FAILURE") {
    return unavailable()
  }

  if (authState.kind === "ANONYMOUS") {
    if ((isProtected || isOnboarding) && priorMarker) {
      markerAction = { value: "", remove: true }
      const requestedPath = isProtected
        ? `${request.nextUrl.pathname}${request.nextUrl.search}`
        : null
      return redirect(buildSessionExpiredLoginPath(priorMarker, requestedPath))
    }
    if (isProtected || isOnboarding) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("lang", requestedLanguage ?? "en")

      if (isProtected) {
        const returnTo = getSafeProtectedReturnTo(
          `${request.nextUrl.pathname}${request.nextUrl.search}`
        )
        if (returnTo) loginUrl.searchParams.set("returnTo", returnTo)
      }

      return finalize(NextResponse.redirect(loginUrl))
    }

    return next()
  }

  markerAction = {
    value: serializeAuthContextMarker(
      authState.kind === "AUTHENTICATED_ONBOARDING_COMPLETE" ? "complete" : "incomplete",
      authState.interfaceLanguage
    ),
  }
  requestHeaders.set("x-interface-locale", authState.interfaceLanguage)
  const onboardingStep = authState.onboardingStep

  if (isProtected && onboardingStep !== "complete") {
    return finalize(
      NextResponse.redirect(new URL("/onboarding", request.url))
    )
  }

  if (isOnboarding && onboardingStep === "complete") {
    return finalize(
      NextResponse.redirect(new URL("/dashboard", request.url))
    )
  }

  if (authState.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE") {
    return isOnboarding ? next() : redirect("/onboarding")
  }

  if (isOnboarding || authorizationPathname === "/register") {
    return redirect("/dashboard")
  }

  if (authorizationPathname === "/login") {
    const destination = resolvePostLoginDestination(
      authState,
      request.nextUrl.searchParams.get("returnTo")
    )
    return destination.ok ? redirect(destination.destination) : unavailable()
  }

  // role check
  if (
    isProtected &&
    isRouteWithin(authorizationPathname, "/handbook")
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authState.userId)
      .single()

    if (!profile || !["owner", "admin", "developer"].includes(profile.role)) {
      return redirect("/")
    }
  }

  return next()
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
