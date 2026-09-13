export function skipsProxyAuth(pathname: string) {
  return (
    pathname === "/api/auth/forgot-password" ||
    pathname === "/api/auth/resend-confirmation" ||
    pathname === "/api/auth/post-login" ||
    isRouteWithin(pathname, "/api/reference") ||
    pathname === "/api/stripe/webhook" ||
    pathname === "/api/cron/auth-email-sync"
  );
}

export function normalizePathnameForAuth(pathname: string) {
  let normalized = pathname;

  for (let pass = 0; pass < pathname.length; pass += 1) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) return normalized;
      normalized = decoded;
    } catch {
      return normalized;
    }
  }

  return normalized;
}

export function isRouteWithin(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(`${root}/`);
}

export function isProtectedAppRoute(pathname: string) {
  return (
    isRouteWithin(pathname, "/dashboard") ||
    isRouteWithin(pathname, "/settings") ||
    isRouteWithin(pathname, "/handbook")
  );
}

export function isOnboardingRoute(pathname: string) {
  return isRouteWithin(pathname, "/onboarding");
}

export function isAuthEntryRoute(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

export function isAuthenticatedApplicationApiRoute(pathname: string) {
  return (
    pathname === "/api/auth/change-email" ||
    pathname === "/api/auth/change-password" ||
    isRouteWithin(pathname, "/api/favorites") ||
    pathname === "/api/nutrition/products/search" ||
    isRouteWithin(pathname, "/api/onboarding") ||
    isRouteWithin(pathname, "/api/profile") ||
    (isRouteWithin(pathname, "/api/stripe") && pathname !== "/api/stripe/webhook")
  );
}

export function isEmailChangeRecoveryRoute(pathname: string, method: string) {
  const normalizedPathname = normalizePathnameForAuth(pathname);
  if (normalizedPathname !== pathname) return false;

  return (
    ((method === "GET" || method === "HEAD") && pathname === "/settings") ||
    (method === "POST" && pathname === "/api/auth/change-email")
  );
}

export function requiresProxyAuth(pathname: string) {
  const normalizedPathname = normalizePathnameForAuth(pathname);
  return (
    isProtectedAppRoute(normalizedPathname) ||
    isOnboardingRoute(normalizedPathname) ||
    isAuthEntryRoute(normalizedPathname) ||
    isAuthenticatedApplicationApiRoute(normalizedPathname)
  );
}
