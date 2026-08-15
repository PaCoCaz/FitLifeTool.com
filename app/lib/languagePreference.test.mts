import assert from "node:assert/strict";
import test from "node:test";
import { asAppLanguage, resolveInterfaceLanguage } from "./languagePreference.ts";

test("Dutch signup metadata is the initial authenticated interface language", () => {
  assert.equal(resolveInterfaceLanguage(null, "nl"), "nl");
});

test("profile language remains the persistent source over signup metadata", () => {
  assert.equal(resolveInterfaceLanguage("de", "nl"), "de");
});

test("unsupported metadata cannot become an interface language", () => {
  assert.equal(asAppLanguage("sv"), null);
  assert.equal(resolveInterfaceLanguage(null, "sv"), "en");
});
