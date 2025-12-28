// app/lib/drinks.ts
export const DRINK_TYPES = {
    water: { label: "Water", factor: 1.0 },
    tea: { label: "Thee", factor: 0.9 },
    coffee: { label: "Koffie", factor: 0.8 },
    soda: { label: "Frisdrank", factor: 0.7 },
    alcohol: { label: "Alcohol", factor: 0.4 },
  } as const;
  