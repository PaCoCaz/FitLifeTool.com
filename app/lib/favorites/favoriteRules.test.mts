// app/lib/favorites/favoriteRules.test.mts

import assert from "node:assert/strict";
import test from "node:test";

import {
  applyFavoriteLimit,
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
