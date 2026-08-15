import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getOnboardingStep } from "./onboardingState.ts";
import { calculateBMI } from "../calculations.ts";

const completeProfile = {
  country_code: "NL", food_region: "BE", gender: "female", birthdate: "1990-01-01",
  height_cm: 170, weight_kg: 65, calculation_sex: "female", activity_level: "moderate",
};

test("onboarding derives every persistent step in order", () => {
  assert.equal(getOnboardingStep(null, false), "profile");
  assert.equal(getOnboardingStep({ ...completeProfile, gender: null }, false), "personal");
  assert.equal(getOnboardingStep({ ...completeProfile, height_cm: null }, false), "body");
  assert.equal(getOnboardingStep({ ...completeProfile, activity_level: null }, false), "final");
  assert.equal(getOnboardingStep(completeProfile, false), "final");
  assert.equal(getOnboardingStep(completeProfile, true), "complete");
});

test("body measurements support the existing BMI calculation", () => {
  assert.equal(calculateBMI(65, 170), 22.5);
});

test("onboarding state supplies persistent body fields to the body step", async () => {
  const [routeSource, flowSource, bodySource] = await Promise.all([
    readFile(new URL("../../api/onboarding/state/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../../components/auth/OnboardingFlow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../components/auth/OnboardingBodyStep.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeSource, /profile,/);
  assert.match(flowSource, /OnboardingBodyStep profile=\{profile\}/);
  assert.match(bodySource, /profile\.weight_kg/);
  assert.match(bodySource, /profile\.height_cm/);
  assert.match(bodySource, /calculateBMI\(weightKg, heightCm\)/);
  assert.doesNotMatch(bodySource, /from\("profiles"\)\.select/);
});
