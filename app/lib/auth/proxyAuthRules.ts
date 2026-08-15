export function skipsProxyAuth(pathname: string) {
  return pathname === "/api/favorites";
}

export function isProtectedAppRoute(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/handbook")
  );
}

export function isOnboardingRoute(pathname: string) {
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}
