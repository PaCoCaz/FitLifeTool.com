// proxy.ts

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import {
  isOnboardingRoute,
  isEmailChangeRecoveryRoute,
  isAuthenticatedApplicationApiRoute,
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
import { readOwnEmailChangeSessionState } from "./app/lib/auth/emailChangeState"
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

  const apiFailure = (code: string, status: number) =>
    finalize(
      NextResponse.json(
        { code },
        {
          status,
          headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
        }
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
  const isProtectedApi = isAuthenticatedApplicationApiRoute(
    authorizationPathname
  )
  const isRecoveryCandidate = isEmailChangeRecoveryRoute(
    pathname,
    request.method
  )

  if (isRecoveryCandidate) {
    let recoveryIdentity: Awaited<ReturnType<typeof supabase.auth.getUser>>
    try {
      recoveryIdentity = await supabase.auth.getUser()
    } catch {
      return unavailable()
    }

    if (!recoveryIdentity.error && recoveryIdentity.data.user) {
      let emailChange: { data: unknown; error: unknown }
      try {
        emailChange = await (supabase as unknown as {
          rpc(name: string): Promise<{ data: unknown; error: unknown }>
        }).rpc("get_own_auth_email_change_state")
      } catch {
        return unavailable()
      }
      if (emailChange.error) return unavailable()
      const emailChangeState = readOwnEmailChangeSessionState(emailChange.data)
      if (!emailChangeState) return unavailable()
      if (emailChangeState.preProviderRecoveryAvailable) return next()
    }
  }

  const authState = await resolveServerAuthState(supabase)

  if (authState.kind === "RESOLUTION_FAILURE") {
    return unavailable()
  }

  if (authState.kind === "ANONYMOUS") {
    if (isProtectedApi) {
      return apiFailure("AUTHENTICATION_REQUIRED", 401)
    }
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

  if (isProtected || isOnboarding || isProtectedApi) {
    let emailChange: { data: unknown; error: unknown }
    try {
      emailChange = await (supabase as unknown as {
        rpc(name: string): Promise<{ data: unknown; error: unknown }>
      }).rpc("get_own_auth_email_change_state")
    } catch {
      return unavailable()
    }
    if (emailChange.error) return unavailable()
    const emailChangeState = readOwnEmailChangeSessionState(emailChange.data)
    if (!emailChangeState) return unavailable()
    if (emailChangeState.requiresReauthentication) {
      if (isProtectedApi) {
        return apiFailure("EMAIL_CHANGE_REAUTH_REQUIRED", 409)
      }
      try {
        const signedOut = await supabase.auth.signOut({ scope: "local" })
        if (signedOut.error) return unavailable()
      } catch {
        return unavailable()
      }
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("lang", authState.interfaceLanguage)
      loginUrl.searchParams.set(
        "auth_notice",
        emailChangeState.status === "canonical_changed" ||
          emailChangeState.status === "completed"
          ? "email_changed"
          : "email_change_pending"
      )
      return finalize(NextResponse.redirect(loginUrl))
    }
  }

  if (isProtectedApi) {
    return next()
  }

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
