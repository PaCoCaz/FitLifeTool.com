// app/lib/uiText.ts

import { Lang } from "./useLang";

/* ───────────────── EN (basis) ───────────────── */

const en = {
  hydration: {
    title: "Hydration",
    addDrink: "Add drink",
    goal: "Daily goal",
    loading: "Loading hydration…",

    drinkLabels: {
      water: "Water",
      tea: "Tea",
      coffee: "Coffee",
      milk: "Milk",
      soda: "Soft drink",
      juice: "Juice / Smoothie",
      sports: "Sports drink",
      energy: "Energy drink",
      beer: "Beer",
      wine: "Wine",
      cocktail: "Cocktail",
      liquor: "Liquor",
    },

    status: {
      noGoal: "No hydration goal set",
      goalReached: "Great job, you reached your hydration goal.",
      ahead: "You're {{value}} ml ahead of schedule",
      behind: "You're {{value}} ml behind schedule",
    },
  },

  activity: {
    title: "Daily Activity",
    goal: "Daily goal",
    minutes: "min",
    loading: "Loading activity…",
    addActivity: "Add activity",

    whichActivity: "Which activity?",
    howLong: "How long?",
    customMinutesPlaceholder: "Or enter minutes manually",
    burnPreview: "Estimated burn:",
    todayOverview: "Today's activity",
    activityLabel: "Activity",
    duration: "Duration",
    total: "Total",

    labels: {
      walking: "Walking",
      cycling: "Cycling",
      running: "Running",
      strength_training: "Strength training",
      yoga: "Yoga",
      swimming: "Swimming",
      skating: "Skating",
      stairs: "Climbing stairs",
    },

    status: {
      noGoal: "No activity goal set",
      goalReached: "Great job, you reached your daily goal.",
      ahead: "You're {{value}} kcal ahead of schedule",
      behind: "You're {{value}} kcal behind schedule",
    },
  },

  common: {
    close: "Close",
  },
};

/* ───────────────── NL ───────────────── */

const nl = {
  hydration: {
    title: "Hydratatie",
    addDrink: "Drinken toevoegen",
    goal: "Dagdoel",
    loading: "Hydratatie laden…",

    drinkLabels: {
      water: "Water",
      tea: "Thee",
      coffee: "Koffie",
      milk: "Melk",
      soda: "Frisdrank",
      juice: "Sap / Smoothie",
      sports: "Sportdrank",
      energy: "Energy drink",
      beer: "Bier",
      wine: "Wijn",
      cocktail: "Cocktail",
      liquor: "Sterke drank",
    },

    status: {
      noGoal: "Geen hydratatiedoel ingesteld",
      goalReached: "Goed bezig, je hebt je hydratatiedoel gehaald.",
      ahead: "Je loopt {{value}} ml voor op je dagschema",
      behind: "Je loopt {{value}} ml achter op je dagschema",
    },
  },

  activity: {
    title: "Dagelijkse activiteiten",
    goal: "Dagdoel",
    minutes: "min",
    loading: "Activiteiten laden…",
    addActivity: "Activiteit toevoegen",

    whichActivity: "Welke activiteit?",
    howLong: "Hoe lang?",
    customMinutesPlaceholder: "Of vul zelf minuten in",
    burnPreview: "Verbranding:",
    todayOverview: "Vandaag bewogen",
    activityLabel: "Activiteit",
    duration: "Duur",
    total: "Totaal",

    labels: {
      walking: "Wandelen",
      cycling: "Fietsen",
      running: "Hardlopen",
      strength_training: "Krachttraining",
      yoga: "Yoga",
      swimming: "Zwemmen",
      skating: "Schaatsen",
      stairs: "Traplopen",
    },

    status: {
      noGoal: "Geen activiteitsdoel ingesteld",
      goalReached: "Goed bezig, je hebt je dagdoel gehaald.",
      ahead: "Je loopt {{value}} kcal voor op je dagschema",
      behind: "Je loopt {{value}} kcal achter op je dagschema",
    },
  },

  common: {
    close: "Sluiten",
  },
};

/* ───────────────── FR ───────────────── */

const fr = {
  hydration: {
    title: "Hydratation",
    addDrink: "Ajouter une boisson",
    goal: "Objectif quotidien",
    loading: "Chargement de l'hydratation…",

    drinkLabels: {
      water: "Eau",
      tea: "Thé",
      coffee: "Café",
      milk: "Lait",
      soda: "Soda",
      juice: "Jus / Smoothie",
      sports: "Boisson sportive",
      energy: "Boisson énergisante",
      beer: "Bière",
      wine: "Vin",
      cocktail: "Cocktail",
      liquor: "Alcool fort",
    },

    status: {
      noGoal: "Aucun objectif d'hydratation défini",
      goalReached: "Bravo, vous avez atteint votre objectif d'hydratation.",
      ahead: "Vous êtes en avance de {{value}} ml sur votre programme",
      behind: "Vous êtes en retard de {{value}} ml sur votre programme",
    },
  },

  activity: {
    title: "Activité quotidienne",
    goal: "Objectif quotidien",
    minutes: "min",
    loading: "Chargement de l'activité…",
    addActivity: "Ajouter une activité",

    whichActivity: "Quelle activité ?",
    howLong: "Combien de temps ?",
    customMinutesPlaceholder: "Ou saisissez les minutes manuellement",
    burnPreview: "Calories estimées :",
    todayOverview: "Activité d'aujourd'hui",
    activityLabel: "Activité",
    duration: "Durée",
    total: "Total",

    labels: {
      walking: "Marche",
      cycling: "Vélo",
      running: "Course",
      strength_training: "Musculation",
      yoga: "Yoga",
      swimming: "Natation",
      skating: "Patinage",
      stairs: "Escaliers",
    },

    status: {
      noGoal: "Aucun objectif d'activité défini",
      goalReached: "Bravo, vous avez atteint votre objectif quotidien.",
      ahead: "Vous avez {{value}} kcal d'avance sur votre programme",
      behind: "Vous avez {{value}} kcal de retard sur votre programme",
    },
  },

  common: {
    close: "Fermer",
  },
};

/* ───────────────── DE ───────────────── */

const de = {
  hydration: {
    title: "Flüssigkeitszufuhr",
    addDrink: "Getränk hinzufügen",
    goal: "Tagesziel",
    loading: "Lade Flüssigkeitsdaten…",

    drinkLabels: {
      water: "Wasser",
      tea: "Tee",
      coffee: "Kaffee",
      milk: "Milch",
      soda: "Softdrink",
      juice: "Saft / Smoothie",
      sports: "Sportgetränk",
      energy: "Energy-Drink",
      beer: "Bier",
      wine: "Wein",
      cocktail: "Cocktail",
      liquor: "Schnaps",
    },

    status: {
      noGoal: "Kein Flüssigkeitsziel festgelegt",
      goalReached: "Super, du hast dein Tagesziel erreicht.",
      ahead: "Du liegst {{value}} ml vor deinem Zeitplan",
      behind: "Du liegst {{value}} ml hinter deinem Zeitplan",
    },
  },

  activity: {
    title: "Tägliche Aktivität",
    goal: "Tagesziel",
    minutes: "Min",
    loading: "Lade Aktivitätsdaten…",
    addActivity: "Aktivität hinzufügen",

    whichActivity: "Welche Aktivität?",
    howLong: "Wie lange?",
    customMinutesPlaceholder: "Oder Minuten manuell eingeben",
    burnPreview: "Geschätzter Verbrauch:",
    todayOverview: "Heutige Aktivität",
    activityLabel: "Aktivität",
    duration: "Dauer",
    total: "Gesamt",

    labels: {
      walking: "Gehen",
      cycling: "Radfahren",
      running: "Laufen",
      strength_training: "Krafttraining",
      yoga: "Yoga",
      swimming: "Schwimmen",
      skating: "Schlittschuhlaufen",
      stairs: "Treppensteigen",
    },

    status: {
      noGoal: "Kein Aktivitätsziel festgelegt",
      goalReached: "Super, du hast dein Tagesziel erreicht.",
      ahead: "Du bist {{value}} kcal vor deinem Zeitplan",
      behind: "Du bist {{value}} kcal hinter deinem Zeitplan",
    },
  },

  common: {
    close: "Schließen",
  },
};

/* ───────────────── PL ───────────────── */

const pl = {
  hydration: {
    title: "Nawodnienie",
    addDrink: "Dodaj napój",
    goal: "Cel dzienny",
    loading: "Ładowanie nawodnienia…",

    drinkLabels: {
      water: "Woda",
      tea: "Herbata",
      coffee: "Kawa",
      milk: "Mleko",
      soda: "Napój gazowany",
      juice: "Sok / Smoothie",
      sports: "Napój sportowy",
      energy: "Napój energetyczny",
      beer: "Piwo",
      wine: "Wino",
      cocktail: "Koktajl",
      liquor: "Alkohol mocny",
    },

    status: {
      noGoal: "Brak ustawionego celu nawodnienia",
      goalReached: "Świetnie, osiągnąłeś dzienny cel nawodnienia.",
      ahead: "Jesteś {{value}} ml przed planem",
      behind: "Jesteś {{value}} ml za planem",
    },
  },

  activity: {
    title: "Dzienne aktywności",
    goal: "Cel dzienny",
    minutes: "min",
    loading: "Ładowanie aktywności…",
    addActivity: "Dodaj aktywność",

    whichActivity: "Jaką aktywność?",
    howLong: "Jak długo?",
    customMinutesPlaceholder: "Lub wpisz liczbę minut ręcznie",
    burnPreview: "Szacowane spalanie:",
    todayOverview: "Dzisiejsza aktywność",
    activityLabel: "Aktywność",
    duration: "Czas trwania",
    total: "Suma",

    labels: {
      walking: "Spacer",
      cycling: "Jazda na rowerze",
      running: "Bieganie",
      strength_training: "Trening siłowy",
      yoga: "Joga",
      swimming: "Pływanie",
      skating: "Jazda na łyżwach",
      stairs: "Wchodzenie po schodach",
    },

    status: {
      noGoal: "Brak ustawionego celu aktywności",
      goalReached: "Świetnie, osiągnąłeś dzienny cel.",
      ahead: "Masz {{value}} kcal przewagi względem planu",
      behind: "Masz {{value}} kcal opóźnienia względem planu",
    },
  },

  common: {
    close: "Zamknij",
  },
};

/* ───────────────── Export ───────────────── */

export const uiText: Record<Lang, any> = {
  en,
  nl,
  fr,
  de,
  pl,
};

/* Helper zodat score-bestanden weten welke taal actief is */
export function getUIText(lang: Lang) {
  const t = uiText[lang];
  t.__lang = lang;
  return t;
}
