import { asAppLanguage, type AppLanguage } from "../languagePreference";

export type EmailChangeCallbackResult = {
  state: "received" | "invalid";
  language: AppLanguage;
};

const MAX_CALLBACK_VALUE_LENGTH = 4096;

function result(state: EmailChangeCallbackResult["state"], language: string | null) {
  return {
    state,
    language: asAppLanguage(language) ?? "en",
  };
}

export function resolveEmailChangeCallback(url: URL) {
  const keys = [...url.searchParams.keys()];
  const allowed = keys.every((key) => key === "code" || key === "message" || key === "lang");
  const single = (key: string) => url.searchParams.getAll(key).length <= 1;
  const code = url.searchParams.get("code");
  const message = url.searchParams.get("message");
  const value = code ?? message;
  const valid = allowed && single("code") && single("message") && single("lang") &&
    (code ? 1 : 0) + (message ? 1 : 0) === 1 && !!value && value.length <= MAX_CALLBACK_VALUE_LENGTH;
  return result(valid ? "received" : "invalid", url.searchParams.get("lang"));
}

export function shouldBootstrapEmailChangeFragment(url: URL) {
  const keys = [...url.searchParams.keys()];
  return keys.every((key) => key === "lang") && url.searchParams.getAll("lang").length <= 1;
}

export function resolveEmailChangeFragmentEvidence(entries: Array<[string, string]>) {
  const allowedKeys = new Set(["transport", "kind", "length", "lang"]);
  const counts = new Map<string, number>();

  for (const [key] of entries) {
    if (!allowedKeys.has(key)) return result("invalid", null);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const single = (key: string) => counts.get(key) === 1;
  if (!single("transport") || !single("kind") || !single("length") || !single("lang")) {
    return result("invalid", null);
  }

  const values = new Map(entries);
  const transport = values.get("transport");
  const kind = values.get("kind");
  const length = values.get("length");
  const language = values.get("lang") ?? null;
  const numericLength = length && /^\d+$/.test(length) ? Number(length) : Number.NaN;
  const valid = transport === "fragment" &&
    (kind === "code" || kind === "message") &&
    Number.isSafeInteger(numericLength) &&
    numericLength >= 1 &&
    numericLength <= MAX_CALLBACK_VALUE_LENGTH;

  return result(valid ? "received" : "invalid", language);
}

export const EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT = String.raw`(() => {
  "use strict";
  const rawFragment = window.location.hash;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);

  let kind = "invalid";
  let length = "0";

  try {
    if (rawFragment.startsWith("#") && rawFragment.length > 1 && rawFragment.length <= 65536) {
      const values = new Map();
      for (const part of rawFragment.slice(1).split("&")) {
        const separator = part.indexOf("=");
        if (separator < 1) throw new Error("invalid fragment field");
        const decode = (value) => decodeURIComponent(value.replace(/\+/g, " "));
        const key = decode(part.slice(0, separator));
        const value = decode(part.slice(separator + 1));
        if (!["code", "message", "sb"].includes(key) || values.has(key)) {
          throw new Error("invalid fragment shape");
        }
        values.set(key, value);
      }

      if (values.has("sb") && values.get("sb") !== "") {
        throw new Error("invalid provider marker");
      }

      const evidenceKeys = ["code", "message"].filter((key) => values.has(key));
      if (evidenceKeys.length !== 1) throw new Error("conflicting fragment evidence");
      const value = values.get(evidenceKeys[0]);
      if (!value || value.length > 4096) throw new Error("invalid fragment evidence");
      kind = evidenceKeys[0];
      length = String(value.length);
    }
  } catch {
    kind = "invalid";
    length = "0";
  }

  const form = document.createElement("form");
  form.method = "post";
  form.action = window.location.pathname + window.location.search;
  const fields = {
    transport: "fragment",
    kind,
    length,
    lang: new URLSearchParams(window.location.search).get("lang") ?? "",
  };
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
})();`;
