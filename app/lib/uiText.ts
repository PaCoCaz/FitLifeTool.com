// app/lib/uiText.ts

import { Lang } from "./useLang";

/* ───────────────── ENGLISH ───────────────── */

const en = {
  nav: {
    dashboard: "Dashboard",
    hydration: "Hydration",
    nutrition: "Nutrition",
    activity: "Activity",
    weight: "Weight",
    handbook: "Handbook",
  },

  hydration: {
    title: "Hydration",

    addDrink: "Drink",
    amount: "Amount",
    dailyGoal: "Daily goal",
    drink: "Drink",
    drinkToday: "Today's drinks",
    factor: "Factor",
    factorTitle: "Hydration factor:",
    factorLine1: "Not all drinks hydrate as effectively as water. Water has a hydration factor of 1.",
    factorLine2: "Drinks containing caffeine, sugar or alcohol contribute less to hydration.",
    fromDrinks: "Hydration from drinks",
    fromFood: "Hydration from food",
    fromFoodAndDrinks: "Hydration from food & drinks",
    hydration: "Hydration",
    hydrationToday: "Today's hydration",
    legend: "Legend",
    loading: "Loading hydration…",
    nothingDrunkToday: "Nothing logged today yet",
    scoreToday: "Today's score",
    total: "Total",

    status: {
      noGoal: "No hydration goal set",
      goalReached: "Great job, you reached your hydration goal.",
      ahead: "You're {{value}} ml ahead of schedule",
      behind: "You're {{value}} ml behind schedule",
    },
  },

  activity: {
    title: "Activity",

    addActivity: "Activity",
    goal: "Daily goal",
    minutes: "min",
    loading: "Loading activity…",


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

    addFood: "Food",
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

  weight: {
    title: "Weight",

    addWeight: "Weight",
    bmi: "BMI",
    editWeight: "Update weight",
    estimatedTargetDate: "Estimated target date around",
    gained: "Weight increased",
    healthy: "Healthy",
    hideBMI: "Hide BMI",
    loading: "Loading weight…",
    lost: "Weight decreased",
    obesity: "Obesity",
    overweight: "Overweight",
    showBMI: "Show BMI",
    stable: "Weight stable",
    targetWeight: "Target weight",
    underweight: "Underweight",
  },

  common: {
    close: "Close",
    favorites: "Favorites",
    period: "Period:",
    save: "Save",
    saved: "Saved",
    saving: "Saving…",
    search: "Search",
    tipOfTheDay: "Tip of the day",
    tipHydration: "Drink a glass of water with every meal to reach your daily goal more easily.",
    today: "Today",
  },
};

/* ───────────────── DUTCH ───────────────── */

const nl = {
  nav: {
    dashboard: "Dashboard",
    hydration: "Hydratatie",
    nutrition: "Voeding",
    activity: "Activiteiten",
    weight: "Gewicht",
    handbook: "Handboek",
  },

  hydration: {
    title: "Hydratatie",

    addDrink: "Drinken",
    amount: "Hoeveel",
    dailyGoal: "Dagdoel",
    drink: "Drank",
    drinkToday: "Vandaag gedronken",
    factor: "Factor",
    factorTitle: "Hydratatiefactor:",
    factorLine1: "Niet alle dranken hydrateren even sterk als water, de hydratatiefactor van water is 1.",
    factorLine2: "Dranken met cafeïne, suiker of alcohol dragen minder bij aan je hydratatie.",
    fromDrinks: "Hydratatie uit dranken",
    fromFood: "Hydratatie uit voeding",
    fromFoodAndDrinks: "Hydratatie uit voeding en dranken",
    hydration: "Hydratatie",
    hydrationToday: "Hydratatie vandaag",
    legend: "Legenda",
    loading: "Hydratatie laden…",
    nothingDrunkToday: "Nog niets gedronken vandaag",
    scoreToday: "Score vandaag",
    total: "Totaal",

    status: {
      noGoal: "Geen hydratatiedoel ingesteld",
      goalReached: "Goed bezig, je hebt je hydratatiedoel gehaald.",
      ahead: "Je loopt {{value}} ml voor op je dagschema",
      behind: "Je loopt {{value}} ml achter op je dagschema",
    },
  },

  activity: {
    title: "Activiteiten",

    addActivity: "Activiteit",
    goal: "Dagdoel",
    minutes: "min",
    loading: "Activiteiten laden…",

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

    addFood: "Voeding",
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

  weight: {
    title: "Gewicht",

    addWeight: "Gewicht",
    bmi: "BMI",
    editWeight: "Gewicht bijwerken",
    estimatedTargetDate: "Verwachte datum streefgewicht rond",
    gained: "Gewicht toegenomen",
    healthy: "Gezond",
    hideBMI: "Verberg BMI",
    loading: "Gewicht laden…",
    lost: "Gewicht afgenomen",
    obesity: "Obesitas",
    overweight: "Overgewicht",
    showBMI: "Toon BMI",
    stable: "Gewicht stabiel",
    targetWeight: "Streefgewicht",
    underweight: "Ondergewicht",
  },

  common: {
    close: "Sluiten",
    favorites: "Favorieten",
    period: "Periode:",
    save: "Opslaan",
    saved: "Opgeslagen",
    saving: "Opslaan…",
    search: "Zoeken",
    tipOfTheDay: "Tip van vandaag",
    tipHydration: "Drink bij elke maaltijd een glas water om je dagdoel makkelijker te halen.",
    today: "Vandaag",
  },
};

/* ───────────────── FRENCH ───────────────── */

const fr = {
  nav: {
    dashboard: "Dashboard",
    hydration: "Hydratation",
    nutrition: "Nutrition",
    activity: "Activités",
    weight: "Poids",
    handbook: "Guide",
  },

  hydration: {
    title: "Hydratation",

    addDrink: "Boire",
    amount: "Quantité",
    dailyGoal: "Objectif quotidien",
    drink: "Boisson",
    drinkToday: "Boissons d'aujourd'hui",
    factor: "Facteur",
    factorTitle: "Facteur d'hydratation :",
    factorLine1: "Toutes les boissons n'hydratent pas aussi bien que l'eau. L'eau a un facteur d'hydratation de 1.",
    factorLine2: "Les boissons contenant de la caféine, du sucre ou de l'alcool contribuent moins à l'hydratation.",
    fromDrinks: "Hydratation provenant des boissons",
    fromFood: "Hydratation provenant de l'alimentation",
    fromFoodAndDrinks: "Hydratation provenant de l'alimentation et des boissons",
    hydration: "Hydratation",
    hydrationToday: "Hydratation du jour",
    legend: "Légende",
    loading: "Chargement de l'hydratation…",
    nothingDrunkToday: "Rien bu aujourd'hui",
    scoreToday: "Score du jour",
    total: "Total",

    status: {
      noGoal: "Aucun objectif d'hydratation défini",
      goalReached: "Bravo, vous avez atteint votre objectif d'hydratation.",
      ahead: "Vous êtes en avance de {{value}} ml sur votre programme",
      behind: "Vous êtes en retard de {{value}} ml sur votre programme",
    },
  },

  activity: {
    title: "Activité quotidienne",

    addActivity: "Activité",
    goal: "Objectif quotidien",
    minutes: "min",
    loading: "Chargement de l'activité…",


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

    addFood: "Alimentation",
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
    total: "Total",

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

  weight: {
    title: "Poids",

    addWeight: "Poids",
    bmi: "IMC",
    editWeight: "Mettre à jour le poids",
    estimatedTargetDate: "Date estimée de l’objectif vers",
    gained: "Poids augmenté",
    healthy: "Poids normal",
    hideBMI: "Masquer l'IMC",
    loading: "Chargement du poids…",
    lost: "Poids diminué",
    obesity: "Obésité",
    overweight: "Surpoids",
    showBMI: "Afficher l'IMC",
    stable: "Poids stable",
    targetWeight: "Poids cible",
    underweight: "Insuffisance pondérale",
  },

  common: {
    close: "Fermer",
    favorites: "Favoris",
    period: "Période :",
    save: "Enregistrer",
    saved: "Enregistré",
    saving: "Enregistrement…",
    search: "Rechercher",
    tipOfTheDay: "Conseil du jour",
    tipHydration: "Buvez un verre d'eau à chaque repas pour atteindre plus facilement votre objectif quotidien.",
    today: "Aujourd'hui",
  },
};

/* ───────────────── GERMAN ───────────────── */

const de = {
  nav: {
    dashboard: "Dashboard",
    hydration: "Hydration",
    nutrition: "Ernährung",
    activity: "Aktivitäten",
    weight: "Gewicht",
    handbook: "Handbuch",
  },

  hydration: {
    title: "Flüssigkeitszufuhr",

    addDrink: "Trinken",
    amount: "Menge",
    dailyGoal: "Tagesziel",
    drink: "Getränk",
    drinkToday: "Heute getrunken",
    factor: "Faktor",
    factorTitle: "Hydrationsfaktor:",
    factorLine1: "Nicht alle Getränke hydratisieren so gut wie Wasser. Wasser hat einen Hydrationsfaktor von 1.",
    factorLine2: "Getränke mit Koffein, Zucker oder Alkohol tragen weniger zur Hydration bei.",
    fromDrinks: "Hydration aus Getränken",
    fromFood: "Hydration aus Nahrung",
    fromFoodAndDrinks: "Hydration aus Nahrung und Getränken",
    hydration: "Hydratation",
    hydrationToday: "Heutige Flüssigkeitszufuhr",
    legend: "Legende",
    loading: "Lade Flüssigkeitsdaten…",
    nothingDrunkToday: "Heute noch nichts getrunken",
    scoreToday: "Heutiger Score",
    total: "Gesamt",

    status: {
      noGoal: "Kein Flüssigkeitsziel festgelegt",
      goalReached: "Super, du hast dein Tagesziel erreicht.",
      ahead: "Du liegst {{value}} ml vor deinem Zeitplan",
      behind: "Du liegst {{value}} ml hinter deinem Zeitplan",
    },
  },

  activity: {
    title: "Tägliche Aktivität",

    addActivity: "Aktivität",
    goal: "Tagesziel",
    minutes: "Min",
    loading: "Lade Aktivitätsdaten…",


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

    addFood: "Ernährung",
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

  weight: {
    title: "Gewicht",

    addWeight: "Gewicht",
    bmi: "BMI",
    editWeight: "Gewicht aktualisieren",
    estimatedTargetDate: "Voraussichtliches Zielgewicht-Datum etwa",
    gained: "Gewicht gestiegen",
    healthy: "Normalgewicht",
    hideBMI: "BMI ausblenden",
    loading: "Gewicht wird geladen…",
    lost: "Gewicht gesunken",
    obesity: "Adipositas",
    overweight: "Übergewicht",
    showBMI: "BMI anzeigen",
    stable: "Gewicht stabil",
    targetWeight: "Zielgewicht",
    underweight: "Untergewicht",
  },

  common: {
    close: "Schließen",
    favorites: "Favoriten",
    period: "Zeitraum:",
    save: "Speichern",
    saved: "Gespeichert",
    saving: "Speichern…",
    search: "Suchen",
    tipOfTheDay: "Tipp des Tages",
    tipHydration: "Trinke zu jeder Mahlzeit ein Glas Wasser, um dein Tagesziel leichter zu erreichen.",
    today: "Heute",
  },
};

/* ───────────────── POLISH ───────────────── */

const pl = {
  nav: {
    dashboard: "Dashboard",
    hydration: "Nawodnienie",
    nutrition: "Odżywianie",
    activity: "Aktywności",
    weight: "Waga",
    handbook: "Poradnik",
  },

  hydration: {
    title: "Nawodnienie",

    addDrink: "Picie",
    amount: "Ile",
    dailyGoal: "Cel dzienny",
    drink: "Napój",
    drinkToday: "Dzisiejsze napoje",
    factor: "Współczynnik",
    factorTitle: "Współczynnik nawodnienia:",
    factorLine1: "Nie wszystkie napoje nawadniają tak skutecznie jak woda. Woda ma współczynnik nawodnienia równy 1.",
    factorLine2: "Napoje zawierające kofeinę, cukier lub alkohol mniej wspierają nawodnienie.",
    fromDrinks: "Nawodnienie z napojów",
    fromFood: "Nawodnienie z żywności",
    fromFoodAndDrinks: "Nawodnienie z jedzenia i napojów",
    hydration: "Nawodnienie",
    hydrationToday: "Dzisiejsze nawodnienie",
    legend: "Legenda",
    loading: "Ładowanie nawodnienia…",
    nothingDrunkToday: "Jeszcze nic dziś nie wypito",
    scoreToday: "Dzisiejszy wynik",
    total: "Suma",

    status: {
      noGoal: "Brak ustawionego celu nawodnienia",
      goalReached: "Świetnie, osiągnąłeś dzienny cel nawodnienia.",
      ahead: "Jesteś {{value}} ml przed planem",
      behind: "Jesteś {{value}} ml za planem",
    },
  },

  activity: {
    title: "Dzienne aktywności",

    addActivity: "Aktywność",
    goal: "Cel dzienny",
    minutes: "min",
    loading: "Ładowanie aktywności…",


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

    addFood: "Jedzenie",
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

  weight: {
    title: "Waga",

    addWeight: "Waga",
    bmi: "BMI",
    editWeight: "Zaktualizuj wagę",
    estimatedTargetDate: "Przewidywana data osiągnięcia celu około",
    gained: "Waga wzrosła",
    healthy: "Prawidłowa waga",
    hideBMI: "Ukryj BMI",
    loading: "Ładowanie wagi…",
    lost: "Waga spadła",
    obesity: "Otyłość",
    overweight: "Nadwaga",
    showBMI: "Pokaż BMI",
    stable: "Waga stabilna",
    targetWeight: "Docelowa waga",
    underweight: "Niedowaga",
  },

  common: {
    close: "Zamknij",
    favorites: "Ulubione",
    period: "Okres:",
    save: "Zapisz",
    saved: "Zapisano",
    saving: "Zapisywanie…",
    search: "Szukaj",
    tipOfTheDay: "Wskazówka dnia",
    tipHydration: "Pij szklankę wody do każdego posiłku, aby łatwiej osiągnąć swój dzienny cel.",
    today: "Dziś",
  },
};

export const uiText: Record<Lang, any> = { en, nl, fr, de, pl };

export function getUIText(lang: Lang) {
  const t = uiText[lang];
  t.__lang = lang;
  return t;
}
