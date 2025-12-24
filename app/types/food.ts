export type PortionMap = {
    [label: string]: number; // gram of ml
  };
  
  export type FoodProduct = {
    id: string;
    name: string;
    unit: "gram" | "ml";
    calories: number; // per 100
    protein: number;
    carbs: number;
    fat: number;
    portions: PortionMap;
  };
  
  export type FoodEntry = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  