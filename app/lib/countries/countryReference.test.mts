import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCountryOptions,
  getCountryOptions,
  normalizeCountryLanguage,
} from "./countryReference.ts";

const countries = [{ country_code: "NL" }, { country_code: "BE" }, { country_code: "GLOBAL" }];
const translations = [
  { country_code: "NL", language_code: "en", name: "Netherlands" },
  { country_code: "NL", language_code: "nl", name: "Nederland" },
  { country_code: "NL", language_code: "fr", name: "Pays-Bas" },
  { country_code: "NL", language_code: "de", name: "Niederlande" },
  { country_code: "NL", language_code: "pl", name: "Niderlandy" },
  { country_code: "BE", language_code: "en", name: "Belgium" },
];

test("country options support all five languages and safe English fallback", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    const result = buildCountryOptions(countries, translations, language);
    assert.equal(result.length, 2);
    assert.ok(result.every(({ country_code }) => /^[A-Z]{2}$/.test(country_code)));
  }

  assert.equal(normalizeCountryLanguage("unknown"), "en");
  assert.equal(buildCountryOptions(countries, translations, "nl").find((row) => row.country_code === "BE")?.name, "Belgium");
});

test("country options use code fallback and deterministic visible-name sorting", () => {
  const result = buildCountryOptions([{ country_code: "ZZ" }, ...countries], translations, "nl");
  assert.deepEqual(result.map(({ country_code }) => country_code), ["BE", "NL", "ZZ"]);
  assert.equal(result.at(-1)?.name, "ZZ");
  assert.ok(!result.some(({ country_code }) => country_code === "GLOBAL"));
});

test("country reference loader reads active database countries and translations", async () => {
  const calls: string[] = [];
  const client = {
    from(table: string) {
      calls.push(table);
      return {
        select() {
          return {
            eq: async () => ({ data: countries, error: null }),
            in: async () => ({ data: translations, error: null }),
          };
        },
      };
    },
  };

  const result = await getCountryOptions(client, "nl");
  assert.deepEqual(calls, ["countries", "country_translations"]);
  assert.equal(result.find((row) => row.country_code === "NL")?.name, "Nederland");
});
