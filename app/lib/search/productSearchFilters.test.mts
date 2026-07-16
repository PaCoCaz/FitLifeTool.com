// app/lib/search/productSearchFilters.test.mts

import assert from "node:assert/strict";
import test from "node:test";

import {
  applyProductSearchFilters,
  rankAndLimitProductSearchResults,
} from "./productSearchFilters.ts";

const products = [
  {
    product_key: "BANANA",
    name: "Banana",
    grade: "A",
    category_key: "FRUITS",
  },
  {
    product_key: "APPLE",
    name: "Apple",
    grade: "B",
    category_key: "FRUITS",
  },
  {
    product_key: "PASTA",
    name: "Pasta",
    grade: "C",
    category_key: "GRAINS",
  },
  {
    product_key: "ALMOND",
    name: "Almond",
    grade: null,
    category_key: "NUTS",
  },
] as const;

test("no filters keeps existing products", () => {
  assert.equal(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: [],
      categories: [],
    }).length,
    products.length
  );
});

test("filters grade A", () => {
  assert.deepEqual(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: ["A"],
      categories: [],
    }).map((product) => product.product_key),
    ["BANANA"]
  );
});

test("filters grades A and B", () => {
  assert.deepEqual(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: ["A", "B"],
      categories: [],
    }).map((product) => product.product_key),
    ["BANANA", "APPLE"]
  );
});

test("filters one category", () => {
  assert.deepEqual(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: [],
      categories: ["GRAINS"],
    }).map((product) => product.product_key),
    ["PASTA"]
  );
});

test("filters multiple categories", () => {
  assert.deepEqual(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: [],
      categories: ["FRUITS", "NUTS"],
    }).map((product) => product.product_key),
    ["BANANA", "APPLE", "ALMOND"]
  );
});

test("combines grade and category", () => {
  assert.deepEqual(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: ["B"],
      categories: ["FRUITS"],
    }).map((product) => product.product_key),
    ["APPLE"]
  );
});

test("filters before top-20 truncation", () => {
  const many = Array.from({ length: 30 }, (_, index) => ({
    product_key: `P${index}`,
    name: `Apple ${String(index).padStart(2, "0")}`,
    grade: index === 29 ? "A" : "B",
    category_key: "FRUITS",
  }));

  const filtered = applyProductSearchFilters(many, {
    enabled: true,
    grades: ["A"],
    categories: [],
  });

  assert.deepEqual(
    rankAndLimitProductSearchResults(filtered, "apple", "en").map(
      (product) => product.product_key
    ),
    ["P29"]
  );
});

test("free user cannot activate filters in filtering logic", () => {
  assert.equal(
    applyProductSearchFilters([...products], {
      enabled: false,
      grades: ["A"],
      categories: ["FRUITS"],
    }).length,
    products.length
  );
});

test("products without grade do not match selected grade", () => {
  assert.equal(
    applyProductSearchFilters([...products], {
      enabled: true,
      grades: ["A"],
      categories: ["NUTS"],
    }).length,
    0
  );
});
