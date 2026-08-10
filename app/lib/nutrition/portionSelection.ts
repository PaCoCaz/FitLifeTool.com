export type OrderedPortion = {
  unit_key: string;
  sort_order: number | null;
};

export type DefaultablePortion = {
  is_default: boolean;
};

export function sortPortionsForDisplay<T extends OrderedPortion>(
  portions: readonly T[]
): T[] {
  return [...portions].sort((a, b) => {
    const orderDifference =
      (a.sort_order ?? 999) - (b.sort_order ?? 999);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return a.unit_key.localeCompare(b.unit_key);
  });
}

export function selectDefaultPortion<T extends DefaultablePortion>(
  portions: readonly T[]
): T | null {
  return (
    portions.find((portion) => portion.is_default) ??
    portions[0] ??
    null
  );
}
