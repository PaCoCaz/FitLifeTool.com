export type Language = "nl" | "en" | "de" | "fr";

export type Labels = {
  water: {
    title: string;
    goal: string;
    empty: string;
    progress: string;
    completed: string;
    add: (amount: number) => string;
  };
  activity: {
    title: string;
    goal: string;
    empty: string;
    progress: string;
    completed: string;
    duration: string;
    add: string;
    save: string;
    cancel: string;
  };
  nutrition: {
    title: string;
    goal: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    empty: string;
    progress: string;
    completed: string;
  };
  weight: {
    title: string;
    unit: string;
    goal: string;
    changeUp: string;
    changeDown: string;
    noChange: string;
    add: string;
    save: string;
    cancel: string;
  };  
  week: {
    title: string;
    subtitle: string;
    avgWeight: string;
    avgCalories: string;
    avgActivity: string;
    unitKg: string;
    unitKcal: string;
    unitMin: string;
  };
  goals: {
    title: string;
    water: string;
    activity: string;
    nutrition: string;
  };
  tip: {
    title: string;
  };
};

export const labels: Record<Language, Labels> = {
  nl: {
    water: {
      title: "Water",
      goal: "Dagdoel",
      empty: "Nog geen water gedronken",
      progress: "Goed bezig, blijf drinken",
      completed: "Dagdoel behaald",
      add: (amount) => `+ ${amount} ml`,
    },
    activity: {
      title: "Activiteiten",
      goal: "Dagdoel",
      empty: "Nog geen activiteiten vandaag",
      progress: "Goed bezig, blijf bewegen",
      completed: "Dagdoel behaald",
      duration: "minuten",
      add: "Activiteit toevoegen",
      save: "Opslaan",
      cancel: "Annuleren",
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
      add: "Gewicht invoeren",
      save: "Opslaan",
      cancel: "Annuleren",
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

  // Tijdelijk: andere talen vallen terug op nl
  en: {} as any,
  de: {} as any,
  fr: {} as any,
};
