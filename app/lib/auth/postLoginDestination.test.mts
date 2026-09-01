import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedPostLoginDestination,
  resolvePostLoginDestination,
} from "./postLoginDestination.ts";
import type { ServerAuthState } from "./serverAuthState.ts";

const incomplete: ServerAuthState = {
  kind: "AUTHENTICATED_ONBOARDING_INCOMPLETE",
  userId: "user-1",
  onboardingStep: "final",
  profileLanguage: "nl",
  interfaceLanguage: "nl",
  profile: null,
};
const complete: ServerAuthState = {
  kind: "AUTHENTICATED_ONBOARDING_COMPLETE",
  userId: "user-1",
  onboardingStep: "complete",
  profileLanguage: "nl",
  interfaceLanguage: "nl",
  profile: {
    country_code: "NL", food_region: "NL", gender: "female", birthdate: "1990-01-01",
    height_cm: 170, weight_kg: 65, calculation_sex: "female", activity_level: "moderate", language: "nl",
  },
};
const anonymous: ServerAuthState = {
  kind: "ANONYMOUS", userId: null, onboardingStep: null, profileLanguage: null,
  interfaceLanguage: "en", profile: null,
};
const failure: ServerAuthState = {
  kind: "RESOLUTION_FAILURE", userId: "user-1", stage: "profile",
  onboardingStep: null, profileLanguage: null, interfaceLanguage: "en", profile: null,
};

test("incomplete users always go to onboarding and never resume returnTo", () => {
  for (const returnTo of [undefined, "/dashboard", "/settings", "/handbook/doc-l3-0001", "https://evil.test"]) {
    assert.deepEqual(resolvePostLoginDestination(incomplete, returnTo), {
      ok: true,
      destination: "/onboarding",
    });
  }
});

test("complete users retain valid protected destinations", () => {
  for (const returnTo of [
    "/dashboard?tab=nutrition",
    "/settings",
    "/settings/profile",
    "/handbook/doc-l3-0001",
  ]) {
    assert.deepEqual(resolvePostLoginDestination(complete, returnTo), {
      ok: true,
      destination: returnTo,
    });
    assert.equal(isAllowedPostLoginDestination(returnTo), true);
  }
});

test("missing and unsafe destinations fall back to dashboard", () => {
  for (const returnTo of [undefined, null, "/", "/login", "/onboarding", "https://evil.test", "//evil.test", "/dashboard%2fadmin", "/dashboard#fragment"]) {
    assert.deepEqual(resolvePostLoginDestination(complete, returnTo), {
      ok: true,
      destination: "/dashboard",
    });
  }
});

test("anonymous and resolution failures do not receive destinations", () => {
  assert.deepEqual(resolvePostLoginDestination(anonymous, "/dashboard"), {
    ok: false,
    code: "AUTHENTICATION_REQUIRED",
  });
  assert.deepEqual(resolvePostLoginDestination(failure, "/dashboard"), {
    ok: false,
    code: "AUTH_STATE_UNAVAILABLE",
  });
});

test("client destination validation admits only onboarding or 04A protected paths", () => {
  for (const value of ["/onboarding", "/dashboard", "/settings", "/handbook/safe"]) {
    assert.equal(isAllowedPostLoginDestination(value), true);
  }
  for (const value of ["/", "/login", "/register", "https://evil.test", null, 1]) {
    assert.equal(isAllowedPostLoginDestination(value), false);
  }
});
