import type { ActivityType } from "@/lib/activityScore";

export type ActivityRow = {
  activity_type: ActivityType;
  duration_minutes: number;
  calories: number;
};

export function groupActivityRows(
  rows: readonly ActivityRow[]
): ActivityRow[] {
  const grouped = new Map<
    ActivityType,
    {
      minutes: number;
      calories: number;
    }
  >();

  for (const row of rows) {
    const current = grouped.get(row.activity_type) ?? {
      minutes: 0,
      calories: 0,
    };

    grouped.set(row.activity_type, {
      minutes: current.minutes + row.duration_minutes,
      calories: current.calories + row.calories,
    });
  }

  return Array.from(grouped, ([activityType, values]) => ({
    activity_type: activityType,
    duration_minutes: Math.round(values.minutes),
    calories: Math.round(values.calories),
  })).sort(
    (a, b) =>
      b.calories - a.calories ||
      a.activity_type.localeCompare(b.activity_type)
  );
}
