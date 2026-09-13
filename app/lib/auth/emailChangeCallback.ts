import { asAppLanguage } from "../languagePreference";
export function resolveEmailChangeCallback(url: URL) {
  const keys = [...url.searchParams.keys()];
  const allowed = keys.every((key) => key === "code" || key === "message" || key === "lang");
  const single = (key: string) => url.searchParams.getAll(key).length <= 1;
  const code = url.searchParams.get("code");
  const message = url.searchParams.get("message");
  const value = code ?? message;
  const valid = allowed && single("code") && single("message") && single("lang") &&
    (code ? 1 : 0) + (message ? 1 : 0) === 1 && !!value && value.length <= 4096;
  return { state: valid ? "received" as const : "invalid" as const, language: asAppLanguage(url.searchParams.get("lang")) ?? "en" };
}
