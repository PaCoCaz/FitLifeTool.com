import { asAppLanguage, type AppLanguage } from "../languagePreference";

export type EmailChangeCallbackResult = {
  state: "received" | "invalid";
  language: AppLanguage;
};

const MAX_CALLBACK_VALUE_LENGTH = 4096;
const MAX_OBSERVED_FIELDS = 32;
const MAX_OBSERVED_NAME_LENGTH = 64;

const OBSERVABLE_CALLBACK_FIELDS = new Set([
  "code", "message", "sb", "lang",
  "access_token", "refresh_token", "expires_in", "expires_at", "token_type", "type",
  "provider_token", "provider_refresh_token",
  "error", "error_code", "error_description", "error_uri",
  "__unknown__", "__malformed__",
]);

type CallbackFieldObservation = {
  name: string;
  count: number;
  duplicate: boolean;
  occurrences: Array<{ empty: boolean; length: number }>;
};

export type EmailChangeCallbackObservation = {
  source: "fragment" | "query";
  totalLength: number;
  fieldCount: number;
  fields: CallbackFieldObservation[];
  parserResult: "received" | "invalid";
};

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

function observedName(name: string) {
  return name.length <= MAX_OBSERVED_NAME_LENGTH && OBSERVABLE_CALLBACK_FIELDS.has(name)
    ? name
    : "__unknown__";
}

function buildObservation(
  source: EmailChangeCallbackObservation["source"],
  totalLength: number,
  entries: Array<[string, string]>,
  parserResult: EmailChangeCallbackObservation["parserResult"],
) {
  const grouped = new Map<string, CallbackFieldObservation>();
  for (const [rawName, value] of entries.slice(0, MAX_OBSERVED_FIELDS)) {
    const name = observedName(rawName);
    const field = grouped.get(name) ?? { name, count: 0, duplicate: false, occurrences: [] };
    field.count += 1;
    field.duplicate = field.count > 1;
    field.occurrences.push({ empty: value.length === 0, length: value.length });
    grouped.set(name, field);
  }
  return {
    source,
    totalLength,
    fieldCount: entries.length,
    fields: [...grouped.values()],
    parserResult,
  } satisfies EmailChangeCallbackObservation;
}

export function observeEmailChangeQuery(url: URL, parserResult: EmailChangeCallbackObservation["parserResult"]) {
  return buildObservation(
    "query",
    url.search.startsWith("?") ? url.search.length - 1 : 0,
    [...url.searchParams.entries()],
    parserResult,
  );
}

function exactKeys(value: Record<string, unknown>, expected: string[]) {
  return Object.keys(value).sort().join(",") === [...expected].sort().join(",");
}

export function parseEmailChangeCallbackObservation(value: unknown): EmailChangeCallbackObservation | null {
  try {
    const observation = typeof value === "string" ? JSON.parse(value) : value;
    if (!observation || typeof observation !== "object" || Array.isArray(observation)) return null;
    const record = observation as Record<string, unknown>;
    if (!exactKeys(record, ["source", "totalLength", "fieldCount", "fields", "parserResult"])) return null;
    if (record.source !== "fragment" && record.source !== "query") return null;
    if (record.parserResult !== "received" && record.parserResult !== "invalid") return null;
    if (!Number.isSafeInteger(record.totalLength) || (record.totalLength as number) < 0 || (record.totalLength as number) > 65536) return null;
    if (!Number.isSafeInteger(record.fieldCount) || (record.fieldCount as number) < 0 || (record.fieldCount as number) > MAX_OBSERVED_FIELDS) return null;
    if (!Array.isArray(record.fields) || record.fields.length > MAX_OBSERVED_FIELDS) return null;

    const names = new Set<string>();
    let observedCount = 0;
    for (const candidate of record.fields) {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
      const field = candidate as Record<string, unknown>;
      if (!exactKeys(field, ["name", "count", "duplicate", "occurrences"])) return null;
      if (typeof field.name !== "string" || observedName(field.name) !== field.name || names.has(field.name)) return null;
      if (!Number.isSafeInteger(field.count) || (field.count as number) < 1 || (field.count as number) > MAX_OBSERVED_FIELDS) return null;
      if (field.duplicate !== ((field.count as number) > 1)) return null;
      if (!Array.isArray(field.occurrences) || field.occurrences.length !== field.count) return null;
      for (const candidateOccurrence of field.occurrences) {
        if (!candidateOccurrence || typeof candidateOccurrence !== "object" || Array.isArray(candidateOccurrence)) return null;
        const occurrence = candidateOccurrence as Record<string, unknown>;
        if (!exactKeys(occurrence, ["empty", "length"])) return null;
        if (typeof occurrence.empty !== "boolean" || !Number.isSafeInteger(occurrence.length) ||
          (occurrence.length as number) < 0 || (occurrence.length as number) > 65536 ||
          occurrence.empty !== (occurrence.length === 0)) return null;
      }
      names.add(field.name);
      observedCount += field.count as number;
    }
    if (observedCount !== record.fieldCount) return null;
    return observation as EmailChangeCallbackObservation;
  } catch {
    return null;
  }
}

export function resolveEmailChangeFragmentEvidence(entries: Array<[string, string]>) {
  const allowedKeys = new Set(["transport", "kind", "length", "lang", "observation"]);
  const counts = new Map<string, number>();

  for (const [key] of entries) {
    if (!allowedKeys.has(key)) return result("invalid", null);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const single = (key: string) => counts.get(key) === 1;
  if (!single("transport") || !single("kind") || !single("length") || !single("lang")) {
    return result("invalid", null);
  }
  if ((counts.get("observation") ?? 0) > 1) return result("invalid", null);

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
  let parserResult = "invalid";
  const knownNames = new Set([
    "code", "message", "sb", "lang",
    "access_token", "refresh_token", "expires_in", "expires_at", "token_type", "type",
    "provider_token", "provider_refresh_token",
    "error", "error_code", "error_description", "error_uri",
    "__unknown__", "__malformed__",
  ]);
  const rawPayload = rawFragment.startsWith("#") ? rawFragment.slice(1) : "";
  const parts = rawPayload ? rawPayload.split("&") : [];
  const observations = new Map();
  const parserFields = new Map();
  let structurallyValid = rawFragment.startsWith("#") && rawPayload.length > 0 && rawPayload.length <= 65536 && parts.length <= 32;

  const observe = (name, empty, valueLength) => {
    const safeName = knownNames.has(name) && name.length <= 64 ? name : "__unknown__";
    const field = observations.get(safeName) ?? { name: safeName, count: 0, duplicate: false, occurrences: [] };
    field.count += 1;
    field.duplicate = field.count > 1;
    field.occurrences.push({ empty, length: valueLength });
    observations.set(safeName, field);
  };

  try {
    if (structurallyValid) {
      for (const part of parts) {
        const separator = part.indexOf("=");
        if (separator < 1) {
          observe("__malformed__", part.length === 0, part.length);
          structurallyValid = false;
          continue;
        }
        const decode = (value) => decodeURIComponent(value.replace(/\+/g, " "));
        let key;
        let value;
        try {
          key = decode(part.slice(0, separator));
          value = decode(part.slice(separator + 1));
        } catch {
          observe("__malformed__", part.slice(separator + 1).length === 0, part.slice(separator + 1).length);
          structurallyValid = false;
          continue;
        }
        observe(key, value.length === 0, value.length);
        const parserField = parserFields.get(key) ?? { count: 0, empty: false, length: 0 };
        parserField.count += 1;
        parserField.empty = value.length === 0;
        parserField.length = value.length;
        parserFields.set(key, parserField);
        if (!["code", "message", "sb"].includes(key) || parserField.count > 1) structurallyValid = false;
      }

      const providerMarker = parserFields.get("sb");
      if (providerMarker && !providerMarker.empty) structurallyValid = false;

      const evidenceKeys = ["code", "message"].filter((key) => parserFields.has(key));
      if (evidenceKeys.length !== 1) structurallyValid = false;
      const evidence = evidenceKeys.length === 1 ? parserFields.get(evidenceKeys[0]) : null;
      if (!evidence || evidence.empty || evidence.length > 4096) structurallyValid = false;
      if (structurallyValid) {
        kind = evidenceKeys[0];
        length = String(evidence.length);
        parserResult = "received";
      }
    }
  } catch {
    kind = "invalid";
    length = "0";
    parserResult = "invalid";
  }

  const observation = {
    source: "fragment",
    totalLength: rawPayload.length,
    fieldCount: parts.length,
    fields: [...observations.values()],
    parserResult,
  };

  const form = document.createElement("form");
  form.method = "post";
  form.action = window.location.pathname + window.location.search;
  const fields = {
    transport: "fragment",
    kind,
    length,
    lang: new URLSearchParams(window.location.search).get("lang") ?? "",
    observation: JSON.stringify(observation),
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
