// app/lib/uiText.ts

import { Lang } from "./useLang";

/* ───────────────── ENGLISH ───────────────── */

const en = {
  hydration: {
    title: "Hydration",
    addDrink: "Add drink",
    goal: "Daily goal",
    loading: "Loading hydration…",

    modalWhatDidYouDrink: "What did you drink?",
    modalHowMuch: "How much did you drink?",
    modalCustomAmount: "Or enter a custom amount (ml)",
    modalToday: "Today's drinks",
    modalDrink: "Drink",
    modalAmount: "Amount",
    modalHydration: "Hydration",
    modalTotal: "Total",
    modalFactorTitle: "Hydration factor:",
    modalFactorLine1:
      "Not all drinks hydrate as effectively as water. Water has a hydration factor of 1.",
    modalFactorLine2:
      "Drinks containing caffeine, sugar or alcohol contribute less to hydration.",

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

  nutrition: {
    title: "Nutrition",
    addFood: "Add food",
    goal: "Daily limit",
    loading: "Loading nutrition…",
    basePlusActivity: "Base {{base}} + daily activity {{activity}}",

    modalMealMoment: "When did you eat this?",
    modalWhatDidYouEat: "What did you eat?",
    modalHowMuch: "How many calories?",
    modalCustomAmount: "Or enter calories manually",
    modalToday: "Today's food",
    modalMeal: "Meal",
    modalCalories: "Calories",
    modalTotal: "Total",

    mealLabels: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      drink_calories: "Calorie drink",
      dessert: "Dessert",
      fast_food: "Fast food",
      other: "Other",
    },

    status: {
      noGoal: "No nutrition goal set",
      onTrack: "You're on schedule",
      behind: "You're {{value}} kcal behind your schedule",
      over: "You're {{value}} kcal above your schedule",
    },
  },

  common: {
    close: "Close",
  },
};

/* ───────────────── DUTCH ───────────────── */

const nl = {
  hydration: {
    title: "Hydratatie",
    addDrink: "Drinken toevoegen",
    goal: "Dagdoel",
    loading: "Hydratatie laden…",

    modalWhatDidYouDrink: "Wat heb je gedronken?",
    modalHowMuch: "Hoeveel heb je gedronken?",
    modalCustomAmount: "Of voer zelf een hoeveelheid in (ml)",
    modalToday: "Vandaag gedronken",
    modalDrink: "Drank",
    modalAmount: "Hoeveelheid",
    modalHydration: "Hydratatie",
    modalTotal: "Totaal",
    modalFactorTitle: "Hydratatiefactor:",
    modalFactorLine1:
      "Niet alle dranken hydrateren even sterk als water, de hydratatiefactor van water is 1.",
    modalFactorLine2:
      "Dranken met cafeïne, suiker of alcohol dragen minder bij aan je hydratatie.",

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

  nutrition: {
    title: "Voeding",
    addFood: "Voeding toevoegen",
    goal: "Daglimiet",
    loading: "Voeding laden…",
    basePlusActivity: "Basis {{base}} + dagelijkse activiteiten {{activity}}",

    modalMealMoment: "Wanneer heb je dit gegeten?",
    modalWhatDidYouEat: "Wat heb je gegeten?",
    modalHowMuch: "Hoeveel calorieën?",
    modalCustomAmount: "Of vul zelf calorieën in",
    modalToday: "Vandaag gegeten",
    modalMeal: "Maaltijd",
    modalCalories: "Calorieën",
    modalTotal: "Totaal",

    mealLabels: {
      breakfast: "Ontbijt",
      lunch: "Lunch",
      dinner: "Diner",
      snack: "Tussendoor",
      drink_calories: "Calorische drank",
      dessert: "Dessert",
      fast_food: "Fastfood",
      other: "Overig",
    },

    status: {
      noGoal: "Geen voedingsdoel ingesteld",
      onTrack: "Je ligt op dagschema",
      behind: "Je loopt {{value}} kcal achter op je dagschema",
      over: "Je zit {{value}} kcal boven je dagschema",
    },
  },

  common: {
    close: "Sluiten",
  },
};

/* ───────────────── FRENCH ───────────────── */

const fr = {
  hydration: {
    title: "Hydratation",
    addDrink: "Ajouter une boisson",
    goal: "Objectif quotidien",
    loading: "Chargement de l'hydratation…",

    modalWhatDidYouDrink: "Qu'avez-vous bu ?",
    modalHowMuch: "Combien avez-vous bu ?",
    modalCustomAmount: "Ou saisissez une quantité personnalisée (ml)",
    modalToday: "Boissons d'aujourd'hui",
    modalDrink: "Boisson",
    modalAmount: "Quantité",
    modalHydration: "Hydratation",
    modalTotal: "Total",
    modalFactorTitle: "Facteur d'hydratation :",
    modalFactorLine1:
      "Toutes les boissons n'hydratent pas aussi bien que l'eau. L'eau a un facteur d'hydratation de 1.",
    modalFactorLine2:
      "Les boissons contenant de la caféine, du sucre ou de l'alcool contribuent moins à l'hydratation.",

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

  nutrition: {
    title: "Nutrition",
    addFood: "Ajouter un aliment",
    goal: "Limite quotidienne",
    loading: "Chargement de la nutrition…",
    basePlusActivity: "Base {{base}} + activité quotidienne {{activity}}",

    modalMealMoment: "Quand avez-vous mangé ceci ?",
    modalWhatDidYouEat: "Qu'avez-vous mangé ?",
    modalHowMuch: "Combien de calories ?",
    modalCustomAmount: "Ou saisissez les calories manuellement",
    modalToday: "Repas d'aujourd'hui",
    modalMeal: "Repas",
    modalCalories: "Calories",
    modalTotal: "Total",

    mealLabels: {
      breakfast: "Petit-déjeuner",
      lunch: "Déjeuner",
      dinner: "Dîner",
      snack: "Collation",
      drink_calories: "Boisson calorique",
      dessert: "Dessert",
      fast_food: "Fast-food",
      other: "Autre",
    },

    status: {
      noGoal: "Aucun objectif nutritionnel défini",
      onTrack: "Vous êtes dans le planning",
      behind: "Vous avez {{value}} kcal de retard sur votre planning",
      over: "Vous avez {{value}} kcal au-dessus de votre planning",
    },
  },

  common: {
    close: "Fermer",
  },
};

/* ───────────────── GERMAN ───────────────── */

const de = {
  hydration: {
    title: "Flüssigkeitszufuhr",
    addDrink: "Getränk hinzufügen",
    goal: "Tagesziel",
    loading: "Lade Flüssigkeitsdaten…",

    modalWhatDidYouDrink: "Was hast du getrunken?",
    modalHowMuch: "Wie viel hast du getrunken?",
    modalCustomAmount: "Oder gib eine eigene Menge ein (ml)",
    modalToday: "Heute getrunken",
    modalDrink: "Getränk",
    modalAmount: "Menge",
    modalHydration: "Hydration",
    modalTotal: "Gesamt",
    modalFactorTitle: "Hydrationsfaktor:",
    modalFactorLine1:
      "Nicht alle Getränke hydratisieren so gut wie Wasser. Wasser hat einen Hydrationsfaktor von 1.",
    modalFactorLine2:
      "Getränke mit Koffein, Zucker oder Alkohol tragen weniger zur Hydration bei.",

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

  nutrition: {
    title: "Ernährung",
    addFood: "Mahlzeit hinzufügen",
    goal: "Tageslimit",
    loading: "Lade Ernährungsdaten…",
    basePlusActivity: "Basis {{base}} + tägliche Aktivität {{activity}}",

    modalMealMoment: "Wann hast du das gegessen?",
    modalWhatDidYouEat: "Was hast du gegessen?",
    modalHowMuch: "Wie viele Kalorien?",
    modalCustomAmount: "Oder Kalorien manuell eingeben",
    modalToday: "Heute gegessen",
    modalMeal: "Mahlzeit",
    modalCalories: "Kalorien",
    modalTotal: "Gesamt",

    mealLabels: {
      breakfast: "Frühstück",
      lunch: "Mittagessen",
      dinner: "Abendessen",
      snack: "Snack",
      drink_calories: "Kaloriengetränk",
      dessert: "Dessert",
      fast_food: "Fastfood",
      other: "Sonstiges",
    },

    status: {
      noGoal: "Kein Ernährungsziel festgelegt",
      onTrack: "Du liegst im Plan",
      behind: "Du liegst {{value}} kcal hinter deinem Plan",
      over: "Du liegst {{value}} kcal über deinem Plan",
    },
  },

  common: {
    close: "Schließen",
  },
};

/* ───────────────── POLISH ───────────────── */

const pl = {
  hydration: {
    title: "Nawodnienie",
    addDrink: "Dodaj napój",
    goal: "Cel dzienny",
    loading: "Ładowanie nawodnienia…",

    modalWhatDidYouDrink: "Co wypiłeś?",
    modalHowMuch: "Ile wypiłeś?",
    modalCustomAmount: "Lub wpisz własną ilość (ml)",
    modalToday: "Dzisiejsze napoje",
    modalDrink: "Napój",
    modalAmount: "Ilość",
    modalHydration: "Nawodnienie",
    modalTotal: "Suma",
    modalFactorTitle: "Współczynnik nawodnienia:",
    modalFactorLine1:
      "Nie wszystkie napoje nawadniają tak skutecznie jak woda. Woda ma współczynnik nawodnienia równy 1.",
    modalFactorLine2:
      "Napoje zawierające kofeinę, cukier lub alkohol mniej wspierają nawodnienie.",

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

  nutrition: {
    title: "Odżywianie",
    addFood: "Dodaj posiłek",
    goal: "Limit dzienny",
    loading: "Ładowanie danych o odżywianiu…",
    basePlusActivity: "Podstawa {{base}} + dzienna aktywność {{activity}}",

    modalMealMoment: "Kiedy to zjadłeś?",
    modalWhatDidYouEat: "Co zjadłeś?",
    modalHowMuch: "Ile kalorii?",
    modalCustomAmount: "Lub wpisz kalorie ręcznie",
    modalToday: "Dzisiejsze posiłki",
    modalMeal: "Posiłek",
    modalCalories: "Kalorie",
    modalTotal: "Suma",

    mealLabels: {
      breakfast: "Śniadanie",
      lunch: "Obiad",
      dinner: "Kolacja",
      snack: "Przekąska",
      drink_calories: "Napój kaloryczny",
      dessert: "Deser",
      fast_food: "Fast food",
      other: "Inne",
    },

    status: {
      noGoal: "Brak ustawionego celu żywieniowego",
      onTrack: "Jesteś zgodnie z planem",
      behind: "Masz {{value}} kcal opóźnienia względem planu",
      over: "Masz {{value}} kcal powyżej planu",
    },
  },

  common: {
    close: "Zamknij",
  },
};

export const uiText: Record<Lang, any> = { en, nl, fr, de, pl };

export function getUIText(lang: Lang) {
  const t = uiText[lang];
  t.__lang = lang;
  return t;
}
