// app/lib/favorites/favoriteRules.test.mts

import assert from "node:assert/strict";
import test from "node:test";

import {
  applyFavoriteLimit,
  buildFavoriteDetails,
  sortFavoriteRows,
} from "./favoriteRules.ts";

const rows = [
  {
    id: "b",
    product_key: "B",
    created_at: "2026-07-14T10:00:00.000Z",
  },
  {
    id: "a",
    product_key: "A",
    created_at: "2026-07-14T09:00:00.000Z",
  },
  {
    id: "c",
    product_key: "C",
    created_at: "2026-07-14T10:00:00.000Z",
  },
];

test("free limit 3 with 10 favorites locks the remaining 7", () => {
  const tenRows = Array.from(
    {
      length: 10,
    },
    (_, index) => ({
      id: String(index).padStart(2, "0"),
      product_key: `P${index}`,
      created_at: `2026-07-14T10:00:${String(index).padStart(2, "0")}.000Z`,
    })
  );

  const result = applyFavoriteLimit(tenRows, 3);

  assert.equal(
    result.filter((favorite) => !favorite.locked).length,
    3
  );
  assert.equal(
    result.filter((favorite) => favorite.locked).length,
    7
  );
});

test("favorites sort by created_at asc", () => {
  assert.deepEqual(
    sortFavoriteRows(rows).map((row) => row.product_key),
    ["A", "B", "C"]
  );
});

test("same created_at uses stable id tie-breaker", () => {
  assert.deepEqual(
    sortFavoriteRows([
      rows[2],
      rows[0],
    ]).map((row) => row.id),
    ["b", "c"]
  );
});

test("null limit means unlimited", () => {
  assert.equal(
    applyFavoriteLimit(rows, null).some(
      (favorite) => favorite.locked
    ),
    false
  );
});

test("upgrade unlocks automatically when limit increases", () => {
  const before = applyFavoriteLimit(rows, 1);
  const after = applyFavoriteLimit(rows, 3);

  assert.equal(before[1].locked, true);
  assert.equal(after[1].locked, false);
});

test("food and drink limits are applied to separate lists", () => {
  const food = applyFavoriteLimit(rows, 1);
  const drink = applyFavoriteLimit(rows, 2);

  assert.deepEqual(
    food.map((favorite) => favorite.locked),
    [false, true, true]
  );

  assert.deepEqual(
    drink.map((favorite) => favorite.locked),
    [false, false, true]
  );
});

test("locked status is derived and does not remove the favorite", () => {
  const result = applyFavoriteLimit(rows, 1);

  assert.equal(result.length, 3);
  assert.equal(result[1].product_key, "B");
  assert.equal(result[1].locked, true);
});

test("a locked favorite can still represent a normally accessible product", () => {
  const result = applyFavoriteLimit(rows, 1);
  const lockedFavorite = result.find(
    (favorite) => favorite.product_key === "B"
  );

  assert.equal(lockedFavorite?.locked, true);
  assert.equal(lockedFavorite?.product_key, "B");
});

const favoriteStates = applyFavoriteLimit(rows, 1);

const products = [
  {
    product_key: "A",
    is_basic: true,
    group_display_key: "FRUITS",
  },
  {
    product_key: "B",
    is_basic: false,
    group_display_key: "VEGETABLES",
  },
  {
    product_key: "C",
    is_basic: true,
    group_display_key: null,
  },
];

const translationsNl = [
  {
    product_key: "A",
    name: "Appel",
  },
  {
    product_key: "B",
    name: "Banaan",
  },
];

const translationsEn = [
  {
    product_key: "A",
    name: "Apple",
  },
  {
    product_key: "B",
    name: "Banana",
  },
];

const preparations = [
  {
    product_key: "A",
    preparation_key: "BOILED",
    sort_order: 2,
  },
  {
    product_key: "A",
    preparation_key: "RAW",
    sort_order: 1,
  },
  {
    product_key: "B",
    preparation_key: "RAW",
    sort_order: 1,
  },
];

const loseScores = [
  {
    product_key: "A",
    preparation_key: "RAW",
    score_grade: "A",
  },
  {
    product_key: "A",
    preparation_key: "BOILED",
    score_grade: "E",
  },
  {
    product_key: "B",
    preparation_key: "RAW",
    score_grade: "C",
  },
];

const gainScores = [
  {
    product_key: "A",
    preparation_key: "RAW",
    score_grade: "D",
  },
  {
    product_key: "B",
    preparation_key: "RAW",
    score_grade: "B",
  },
];

test("favorite details include complete API response fields", () => {
  const result = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsNl,
    preparations,
    loseScores
  );

  assert.deepEqual(result[0], {
    id: "a",
    product_key: "A",
    created_at: "2026-07-14T09:00:00.000Z",
    position: 1,
    locked: false,
    display_name: "Appel",
    group_display_key: "FRUITS",
    is_basic: true,
    grade: "A",
  });
});

test("favorite details use the requested language translations", () => {
  const result = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsEn,
    preparations,
    loseScores
  );

  assert.equal(result[0].display_name, "Apple");
  assert.equal(result[1].display_name, "Banana");
});

test("favorite details use goal dependent grades", () => {
  const lose = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsNl,
    preparations,
    loseScores
  );

  const gain = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsNl,
    preparations,
    gainScores
  );

  assert.equal(lose[0].grade, "A");
  assert.equal(gain[0].grade, "D");
});

test("favorite details preserve locked status and stable order", () => {
  const result = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsNl,
    preparations,
    loseScores
  );

  assert.deepEqual(
    result.map((favorite) => favorite.product_key),
    ["A", "B", "C"]
  );

  assert.deepEqual(
    result.map((favorite) => favorite.locked),
    [false, true, true]
  );
});

test("favorite details return null grade when preparation or score is missing", () => {
  const result = buildFavoriteDetails(
    favoriteStates,
    products,
    translationsNl,
    preparations,
    loseScores
  );

  assert.equal(result[2].product_key, "C");
  assert.equal(result[2].display_name, "C");
  assert.equal(result[2].grade, null);
});

test("favorite details keep an empty favorites list empty", () => {
  assert.deepEqual(
    buildFavoriteDetails(
      [],
      products,
      translationsNl,
      preparations,
      loseScores
    ),
    []
  );
});
