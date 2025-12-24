import type { FoodProduct } from "../types/food";

export const FOODS: FoodProduct[] = [
  {
    id: "apple",
    name: "Appel",
    unit: "gram",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    portions: {
        "1 g": 1,
        "100 g": 100,
        "1 klein": 120,
        "1 middel": 180,
        "1 groot": 220,
    },
  },
  {
    id: "milk_semi",
    name: "Halfvolle melk",
    unit: "ml",
    calories: 46,
    protein: 3.4,
    carbs: 4.8,
    fat: 1.5,
    portions: {
        "1 ml": 1,
        "100 ml": 100,
        "1 glas": 250,
    },
  },
];
