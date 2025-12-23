export type Language = "nl" | "en" | "de" | "fr";

export const labels = {
  nl: {
    water: {
      title: "Water",
      goal: "Dagdoel",
      empty: "Nog geen water gedronken",
      progress: "Goed bezig, blijf drinken",
      completed: "Dagdoel behaald",
      add: (amount: number) => `+ ${amount} ml`,
    },

    activity: {
      title: "Activiteiten",
      goal: "Dagdoel",
      empty: "Nog geen activiteiten vandaag",
      progress: "Goed bezig, blijf bewegen",
      completed: "Dagdoel behaald",
      duration: "minuten",
    },

    nutrition: {
      title: "Voeding",
      goal: "Dagdoel",
      calories: "kcal",
      protein: "Eiwit",
      carbs: "Koolhydraten",
      fat: "Vetten",
      empty: "Nog geen voeding gelogd vandaag",
      progress: "Goed bezig met je voeding",
      completed: "Dagdoel behaald",
    },
    
    weight: {
      title: "Gewicht",
      unit: "kg",
      goal: "Streefgewicht",
      changeUp: "Toename t.o.v. gisteren",
      changeDown: "Afname t.o.v. gisteren",
      noChange: "Geen verandering t.o.v. gisteren",
    },
    
    week: {
      title: "Weekoverzicht",
      subtitle: "Laatste 7 dagen",
      avgWeight: "Gemiddeld gewicht",
      avgCalories: "Gem. calorieën",
      avgActivity: "Gem. activiteit",
      unitKg: "kg",
      unitKcal: "kcal",
      unitMin: "min",
    },
    
    goals: {
      title: "Dagdoelen",
      water: "Water",
      activity: "Activiteit",
      nutrition: "Voeding",
    },
    
    tip: {
      title: "Tip van vandaag",
    },    
  },
} as const;

