export function skipsProxyAuth(pathname: string) {
  return pathname === "/api/favorites";
}
