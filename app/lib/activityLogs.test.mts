import assert from "node:assert/strict";
import test from "node:test";

import {
  groupActivityRows,
  type ActivityRow,
} from "./activityLogs.ts";

test("returns an empty list for an empty input", () => {
  assert.deepEqual(groupActivityRows([]), []);
});

test("keeps one activity and rounds its values", () => {
  assert.deepEqual(
    groupActivityRows([
      {
        activity_type: "walking",
        duration_minutes: 12.4,
        calories: 51.6,
      },
    ]),
    [
      {
        activity_type: "walking",
        duration_minutes: 12,
        calories: 52,
      },
    ]
  );
});

test("groups multiple rows with the same activity type", () => {
  assert.deepEqual(
    groupActivityRows([
      {
        activity_type: "cycling",
        duration_minutes: 10,
        calories: 40,
      },
      {
        activity_type: "cycling",
        duration_minutes: 15,
        calories: 60,
      },
    ]),
    [
      {
        activity_type: "cycling",
        duration_minutes: 25,
        calories: 100,
      },
    ]
  );
});

test("keeps different activity types separate", () => {
  const result = groupActivityRows([
    {
      activity_type: "walking",
      duration_minutes: 20,
      calories: 60,
    },
    {
      activity_type: "running",
      duration_minutes: 10,
      calories: 120,
    },
  ]);

  assert.deepEqual(
    result.map((row) => row.activity_type),
    ["running", "walking"]
  );
});

test("adds minutes before applying the existing rounding", () => {
  const [result] = groupActivityRows([
    {
      activity_type: "yoga",
      duration_minutes: 10.4,
      calories: 20,
    },
    {
      activity_type: "yoga",
      duration_minutes: 10.4,
      calories: 20,
    },
  ]);

  assert.equal(result.duration_minutes, 21);
});

test("adds calories before applying the existing rounding", () => {
  const [result] = groupActivityRows([
    {
      activity_type: "swimming",
      duration_minutes: 10,
      calories: 40.4,
    },
    {
      activity_type: "swimming",
      duration_minutes: 10,
      calories: 40.4,
    },
  ]);

  assert.equal(result.calories, 81);
});

test("sorts grouped activities by calories descending", () => {
  const result = groupActivityRows([
    {
      activity_type: "walking",
      duration_minutes: 30,
      calories: 80,
    },
    {
      activity_type: "running",
      duration_minutes: 10,
      calories: 140,
    },
    {
      activity_type: "yoga",
      duration_minutes: 45,
      calories: 100,
    },
  ]);

  assert.deepEqual(
    result.map((row) => row.calories),
    [140, 100, 80]
  );
});

test("uses activity type as a stable tie-breaker", () => {
  const result = groupActivityRows([
    {
      activity_type: "yoga",
      duration_minutes: 20,
      calories: 50,
    },
    {
      activity_type: "cycling",
      duration_minutes: 10,
      calories: 50,
    },
  ]);

  assert.deepEqual(
    result.map((row) => row.activity_type),
    ["cycling", "yoga"]
  );
});

test("does not mutate the input array or its rows", () => {
  const rows: ActivityRow[] = [
    {
      activity_type: "walking",
      duration_minutes: 20,
      calories: 60,
    },
    {
      activity_type: "running",
      duration_minutes: 10,
      calories: 120,
    },
  ];
  const snapshot = structuredClone(rows);

  groupActivityRows(rows);

  assert.deepEqual(rows, snapshot);
});
