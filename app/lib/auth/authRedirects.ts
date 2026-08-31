import {
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference";

const PROTECTED_RETURN_TO_ROOTS = [
  "/dashboard",
  "/settings",
  "/handbook",
] as const;

export const AUTH_NOTICE_IDS = [
  "confirmation_failed",
  "session_expired",
  "password_reset",
] as const;

export type AuthNotice = (typeof AUTH_NOTICE_IDS)[number];

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/;
const WHITESPACE_PATTERN = /\s/;
const ENCODED_PATH_SEPARATOR_PATTERN = /%(?:25|2f|5c)/i;
const SCHEME_PATTERN = /(?:^|[^a-z0-9+.-])[a-z][a-z0-9+.-]*:/i;
const SLASH_LOOKALIKE_PATTERN = /[\u2044\u2215\u29f5\uff0f\uff3c]/;

function safelyDecodeLayers(value: string): string[] | null {
  const layers = [value];
  let current = value;

  try {
    for (let depth = 0; depth < 3; depth += 1) {
      const decoded = decodeURIComponent(current);
      if (decoded === current) return layers;
      layers.push(decoded);
      current = decoded;
    }
    return decodeURIComponent(current) === current ? layers : null;
  } catch {
    return null;
  }
}

function hasUnsafeRedirectSyntax(value: string): boolean {
  return (
    value.includes("\\") ||
    value.includes("#") ||
    value.includes("//") ||
    CONTROL_CHARACTER_PATTERN.test(value) ||
    WHITESPACE_PATTERN.test(value) ||
    SCHEME_PATTERN.test(value) ||
    SLASH_LOOKALIKE_PATTERN.test(value)
  );
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_RETURN_TO_ROOTS.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`)
  );
}

export function getSafeProtectedReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (hasUnsafeRedirectSyntax(value)) return null;

  const queryIndex = value.indexOf("?");
  const pathname = queryIndex === -1 ? value : value.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : value.slice(queryIndex + 1);

  if (!pathname || ENCODED_PATH_SEPARATOR_PATTERN.test(pathname)) return null;

  const pathnameLayers = safelyDecodeLayers(pathname);
  const queryLayers = safelyDecodeLayers(query);
  if (pathnameLayers == null || queryLayers == null) return null;
  if (
    pathnameLayers.some(hasUnsafeRedirectSyntax) ||
    queryLayers.some(hasUnsafeRedirectSyntax)
  ) {
    return null;
  }

  const decodedPathname = pathnameLayers.at(-1)!;

  const segments = decodedPathname.split("/");
  if (segments.some((segment) => segment === "." || segment === "..")) {
    return null;
  }

  return isProtectedPath(decodedPathname) ? value : null;
}

export function asAuthNotice(value: unknown): AuthNotice | null {
  return AUTH_NOTICE_IDS.includes(value as AuthNotice)
    ? (value as AuthNotice)
    : null;
}

export function asAuthLocale(value: unknown): AppLanguage | null {
  return asAppLanguage(value);
}
