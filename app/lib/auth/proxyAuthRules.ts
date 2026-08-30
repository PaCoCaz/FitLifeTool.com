export function skipsProxyAuth(pathname: string) {
  return pathname === "/api/favorites";
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

export function requiresProxyAuth(pathname: string) {
  const normalizedPathname = normalizePathnameForAuth(pathname);
  return (
    isProtectedAppRoute(normalizedPathname) ||
    isOnboardingRoute(normalizedPathname)
  );
}
