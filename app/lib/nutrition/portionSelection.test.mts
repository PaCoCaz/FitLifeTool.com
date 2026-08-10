import assert from "node:assert/strict";
import test from "node:test";

import {
  selectDefaultPortion,
  sortPortionsForDisplay,
} from "./portionSelection.ts";

type TestPortion = {
  unit_key: string;
  sort_order: number;
  is_default: boolean;
};

const peanutButterPortions: TestPortion[] = [
  {
    unit_key: "TABLESPOON",
    sort_order: 3,
    is_default: false,
  },
  {
    unit_key: "FOR_1_SLICE",
    sort_order: 2,
    is_default: true,
  },
  {
    unit_key: "GRAM",
    sort_order: 99,
    is_default: false,
  },
  {
    unit_key: "FOR_1_CRACKER",
    sort_order: 1,
    is_default: false,
  },
];

test("display order follows sort_order without making the first portion default", () => {
  const displayed = sortPortionsForDisplay(peanutButterPortions);

  assert.deepEqual(
    displayed.map((portion) => portion.unit_key),
    ["FOR_1_CRACKER", "FOR_1_SLICE", "TABLESPOON", "GRAM"]
  );
  assert.equal(
    selectDefaultPortion(displayed)?.unit_key,
    "FOR_1_SLICE"
  );
});

test("a default at sort_order 2 or higher is selected", () => {
  const cheese30 = sortPortionsForDisplay([
    { unit_key: "GRAM", sort_order: 99, is_default: false },
    { unit_key: "SLICE_PRECUT", sort_order: 3, is_default: false },
    { unit_key: "FOR_1_SLICE", sort_order: 2, is_default: true },
    { unit_key: "CUBE", sort_order: 1, is_default: false },
  ]);
  const gouda = sortPortionsForDisplay([
    { unit_key: "GRAM", sort_order: 99, is_default: false },
    { unit_key: "SLICE_PRECUT", sort_order: 4, is_default: false },
    { unit_key: "FOR_1_SLICE", sort_order: 3, is_default: true },
    { unit_key: "FOR_1_TOAST", sort_order: 2, is_default: false },
    { unit_key: "CUBE", sort_order: 1, is_default: false },
  ]);

  assert.equal(selectDefaultPortion(cheese30)?.unit_key, "FOR_1_SLICE");
  assert.equal(selectDefaultPortion(gouda)?.unit_key, "FOR_1_SLICE");
});

test("switching preparation selects the default of the new preparation", () => {
  const firstPreparation = sortPortionsForDisplay([
    { unit_key: "PIECE", sort_order: 1, is_default: true },
    { unit_key: "GRAM", sort_order: 99, is_default: false },
  ]);
  const nextPreparation = sortPortionsForDisplay([
    { unit_key: "TABLESPOON", sort_order: 1, is_default: false },
    { unit_key: "SERVING_SPOON", sort_order: 2, is_default: true },
    { unit_key: "GRAM", sort_order: 99, is_default: false },
  ]);

  assert.equal(
    selectDefaultPortion(firstPreparation)?.unit_key,
    "PIECE"
  );
  assert.equal(
    selectDefaultPortion(nextPreparation)?.unit_key,
    "SERVING_SPOON"
  );
});

test("the first displayed portion is only a fallback without a database default", () => {
  const displayed = sortPortionsForDisplay([
    { unit_key: "GRAM", sort_order: 99, is_default: false },
    { unit_key: "TABLESPOON", sort_order: 2, is_default: false },
    { unit_key: "TEASPOON", sort_order: 1, is_default: false },
  ]);

  assert.equal(
    selectDefaultPortion(displayed)?.unit_key,
    "TEASPOON"
  );
  assert.equal(selectDefaultPortion([]), null);
});
