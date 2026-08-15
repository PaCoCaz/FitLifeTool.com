import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateBMI } from "./calculations.ts";
import {
  canLoadWeightProfile,
  resolveWeightSummary,
} from "./weightSummary.ts";

const baseProfile = {
  weight_kg: 80,
  height_cm: 180,
  bmi: null,
  target_weight_kg: null,
};

test("weight and height calculate BMI when stored BMI is null", () => {
  assert.deepEqual(
    resolveWeightSummary(baseProfile, null, calculateBMI),
    { weight: 80, bmi: 24.7, targetWeight: null }
  );
});

test("stored BMI is used when present", () => {
  const summary = resolveWeightSummary(
    { ...baseProfile, bmi: 24.6 },
    null,
    () => {
      throw new Error("BMI should not be recalculated");
    }
  );

  assert.equal(summary?.bmi, 24.6);
});

test("zero profile rows produce a terminal unavailable result", () => {
  assert.equal(resolveWeightSummary(null, null, calculateBMI), null);
});

test("a query error produces a terminal unavailable result", () => {
  assert.equal(
    resolveWeightSummary(baseProfile, { code: "PGRST116" }, calculateBMI),
    null
  );
});

test("no authenticated user skips the profile load", () => {
  assert.equal(canLoadWeightProfile(null), false);
  assert.equal(canLoadWeightProfile(undefined), false);
  assert.equal(canLoadWeightProfile("user-id"), true);
});

test("weight logs do not influence dashboard weight rendering", async () => {
  const source = await readFile(
    new URL("../components/dashboard/WeightCard.tsx", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(source, /weight_logs/);
  assert.match(source, /\.maybeSingle\(\)/);
  assert.match(source, /status: summary \? "ready" : "unavailable"/);
  assert.match(source, /: "loading";/);
});
