// app/lib/uiText.ts

import { Lang } from "./useLang";

export const uiText: Record<Lang, any> = {
  en: {
    hydration: {
      title: "Hydration",
      addDrink: "Add drink",
      goal: "Daily goal",
      loading: "Loading hydration…",
    },
    activity: {
      title: "Daily Activity",
      goal: "Daily goal",
      minutes: "min",
      loading: "Loading activity…",
      addActivity: "Add activity",

      status: {
        noGoal: "No activity goal set",
        goalReached: "Great job, you reached your daily goal.",
        ahead: "You're {{value}} kcal ahead of schedule",
        behind: "You're {{value}} kcal behind schedule",
      },
    },
  },

  nl: {
    hydration: {
      title: "Hydratatie",
      addDrink: "Drinken toevoegen",
      goal: "Dagdoel",
      loading: "Hydratatie laden…",
    },
    activity: {
      title: "Dagelijkse activiteiten",
      goal: "Dagdoel",
      minutes: "min",
      loading: "Activiteiten laden…",
      addActivity: "Activiteit toevoegen",

      status: {
        noGoal: "Geen activiteitsdoel ingesteld",
        goalReached: "Goed bezig, je hebt je dagdoel gehaald.",
        ahead: "Je loopt {{value}} kcal voor op je dagschema",
        behind: "Je loopt {{value}} kcal achter op je dagschema",
      },
    },
  },
};
