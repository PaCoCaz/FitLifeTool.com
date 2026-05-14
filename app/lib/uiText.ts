// app/lib/uiText.ts

import { Lang } from "./useLang";

/* ───────────────── ENGLISH ───────────────── */

const en = {

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

  common: {
    account: "Account",
    add: "Add",
    close: "Close",
    email: "Email",
    favoriteLimitUpgrade: "You have reached your limit of {{limit}} favorites.\nUpgrade your account to add more favorites.",
    favorites: "Favorites",
    firstName: "First name",
    goal: "Goal",
    language: "Language",
    lastDays: "Last {{days}} days",
    lastName: "Last name",
    logout: "Logout",
    period: "Period:",
    product: "Product",
    save: "Save",
    saved: "Saved",
    saving: "Saving…",
    score: "Score",
    search: "Search",
    select: "Select",
    tipOfTheDay: "Tip of the day",
    tipHydration: "Drink a glass of water with every meal to reach your daily goal more easily.",
    today: "Today",
  },

  goal: {
    current: "Current goal",
  },

  goalDescriptions: {
    lose: "You want to gradually lose weight and live healthier.",
    maintain: "You want to maintain your current weight and lifestyle.",
    gain: "You want to gradually gain weight and live healthier.",
    holiday: "Relax without a goal and just track your habits.",
  },

  goals: {
    lose: "Lose weight",
    maintain: "Maintain weight",
    gain: "Gain weight",
    holiday: "Holiday mode",
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

  lifestyle: {
    title: "Lifestyle",
    activityLevel: "Activity level",

    sedentary: {
      label: "Sedentary",
      desc: "Mostly sitting, little movement (e.g. less than 5000 steps per day).",
    },

    light: {
      label: "Lightly active",
      desc: "Mostly sitting but some movement (e.g. 5000–8000 steps or occasional exercise).",
    },

    moderate: {
      label: "Moderately active",
      desc: "Active days with movement (e.g. 8000–12000 steps, sports or physical work).",
    },

    active: {
      label: "Active",
      desc: "High daily movement, physical work or frequent exercise (usually more than 12000 steps).",
    },

    veryActive: {
      label: "Very active",
      desc: "Heavy physical work, intense training or professional sports.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    drink: "Drink",
    hydration: "Hydration",
    nutrition: "Nutrition",
    activity: "Activity",
    weight: "Weight",
    handbook: "Handbook",
  },

  nutrition: {
    title: "Nutrition",

    addFood: "Food",
    amount: "Amount",
    carbs: "Carbohydrates",
    energy: "Energy",
    fat: "Fat",
    fiber: "Fiber",
    goal: "Daily limit",
    loading: "Loading nutrition…",
    preparation: "Preparation",
    protein: "Protein",
    salt: "Salt",
    searchProduct: "Search product...",
    sugar: "Sugar",
    unit: "Unit",

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

  profile: {
    healthProfile: "Health profile",
    birthDate: "Date of birth",

    gender: {
      description: "We use biological sex for accurate health and energy calculations.",
      female: "Female",
      label: "Gender",
      male: "Male",
    },

    height: "Height",
    weight: "Weight",
  },

  settings: {
    title: "Settings",
  },

  subscription: {
    title: "Subscription",
    loading: "Loading...",

    currentPlan: "Current plan",
    status: "Status",
    renew: "Next renewal",

    actions: {
      change: "Change subscription",
      manage: "Manage subscription",
    },

    plans: {
      free: "Free",
      premium: "Premium",
      pro: "Pro",
    },

    pricing: {
      premium: "€ 4.95 / month",
      pro: "€ 8.95 / month",
    },
  },

  units: {
    cm: "cm",
    kg: "kg",
  },

  weight: {
    title: "Weight",

    addWeight: "Weight",
    average: "Average",
    bmi: "BMI",
    editWeight: "Update weight",
    estimatedTargetDate: "Estimated target date around",
    gained: "Weight increased",
    healthy: "Healthy",
    hideBMI: "Hide BMI",
    loading: "Loading weight…",
    loadingHistory: "Loading weight history…",
    lost: "Weight decreased",
    obesity: "Obesity",
    overweight: "Overweight",
    showBMI: "Show BMI",
    stable: "Weight stable",
    targetWeight: "Target weight",
    underweight: "Underweight",
  },

};

/* ───────────────── DUTCH ───────────────── */

const nl = {

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

  common: {
    account: "Account",
    add: "Toevoegen",
    close: "Sluiten",
    email: "E-mail",
    favoriteLimitUpgrade: "Je hebt je limiet van {{limit}} favorieten bereikt.\nUpgrade je account om meer favorieten toe te kunnen voegen.",
    favorites: "Favorieten",
    firstName: "Voornaam",
    goal: "Doel",
    language: "Taal",
    lastDays: "Laatste {{days}} dagen",
    lastName: "Achternaam",
    logout: "Uitloggen",
    period: "Periode:",
    product: "Product",
    save: "Opslaan",
    saved: "Opgeslagen",
    saving: "Opslaan…",
    score: "Score",
    search: "Zoeken",
    select: "Selecteer",
    tipOfTheDay: "Tip van vandaag",
    tipHydration: "Drink bij elke maaltijd een glas water om je dagdoel makkelijker te halen.",
    today: "Vandaag",
  },

  goal: {
    current: "Huidig doel",
  },

  goalDescriptions: {
    lose: "Je wilt geleidelijk gewicht verliezen en gezonder leven.",
    maintain: "Je wilt je huidige gewicht en leefstijl in balans houden.",
    gain: "Je wilt geleidelijk aankomen en gezonder leven.",
    holiday: "Even geen doel, alleen je gewoonten bijhouden.",
  },

  goals: {
    lose: "Afvallen",
    maintain: "Gewicht behouden",
    gain: "Aankomen",
    holiday: "Vakantiemodus",
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

  lifestyle: {
    title: "Lifestyle",
    activityLevel: "Activiteitsniveau",

    sedentary: {
      label: "Weinig actief",
      desc: "Overwegend zittend werk, weinig beweging (bijv. minder dan 5000 stappen per dag).",
    },

    light: {
      label: "Licht actief",
      desc: "Zittend werk, maar regelmatig bewegen (bijv. 5000-8000 stappen of af en toe sporten).",
    },

    moderate: {
      label: "Gemiddeld actief",
      desc: "Actieve dagen met veel bewegen (bijv. 8000-12000 stappen, sport of fysiek werk).",
    },

    active: {
      label: "Actief",
      desc: "Veel dagelijkse beweging, fysiek werk of vaak sporten (meestal meer dan 12000 stappen).",
    },

    veryActive: {
      label: "Zeer actief",
      desc: "Zwaar fysiek werk, intensieve training of topsport.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    drink: "Drinken",
    hydration: "Hydratatie",
    nutrition: "Voeding",
    activity: "Activiteiten",
    weight: "Gewicht",
    handbook: "Handboek",
  },

  nutrition: {
    title: "Voeding",

    addFood: "Voeding",
    amount: "Aantal",
    carbs: "Koolhydraten",
    energy: "Energie",
    fat: "Vetten",
    fiber: "Vezels",
    goal: "Daglimiet",
    loading: "Voeding laden…",
    preparation: "Bereiding",
    protein: "Eiwitten",
    salt: "Zout",
    searchProduct: "Zoek product...",
    sugar: "Suiker",
    unit: "Eenheid",

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

  profile: {
    healthProfile: "Gezondheidsprofiel",
    birthDate: "Geboortedatum",

    gender: {
      description: "Voor nauwkeurige gezondheids- en energieberekeningen gebruiken we biologisch geslacht.",
      female: "Vrouw",
      label: "Geslacht",
      male: "Man",
    },

    height: "Lengte",
    weight: "Gewicht",
  },

  settings: {
    title: "Instellingen",
  },

  subscription: {
    title: "Abonnement",
    loading: "Laden...",

    currentPlan: "Huidig abonnement",
    status: "Status",
    renew: "Volgende verlenging",

    actions: {
      change: "Wijzig abonnement",
      manage: "Beheer abonnement",
    },

    plans: {
      free: "Free",
      premium: "Premium",
      pro: "Pro",
    },

    pricing: {
      premium: "€ 4,95 / maand",
      pro: "€ 8,95 / maand",
    },
  },

  units: {
    cm: "cm",
    kg: "kg",
  },

  weight: {
    title: "Gewicht",

    addWeight: "Gewicht",
    average: "Gemiddelde",
    bmi: "BMI",
    editWeight: "Gewicht bijwerken",
    estimatedTargetDate: "Verwachte datum streefgewicht rond",
    gained: "Gewicht toegenomen",
    healthy: "Gezond",
    hideBMI: "Verberg BMI",
    loading: "Gewicht laden…",
    loadingHistory: "Gewichtsgeschiedenis laden…",
    lost: "Gewicht afgenomen",
    obesity: "Obesitas",
    overweight: "Overgewicht",
    showBMI: "Toon BMI",
    stable: "Gewicht stabiel",
    targetWeight: "Streefgewicht",
    underweight: "Ondergewicht",
  },

};

/* ───────────────── FRENCH ───────────────── */

const fr = {

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

  common: {
    account: "Compte",
    add: "Ajouter",
    close: "Fermer",
    email: "E-mail",
    favoriteLimitUpgrade: "Vous avez atteint votre limite de {{limit}} favoris.\nMettez à niveau votre compte pour pouvoir ajouter plus de favoris.",
    favorites: "Favoris",
    firstName: "Prénom",
    goal: "Doel",
    language: "Langue",
    lastDays: "Derniers {{days}} jours",
    lastName: "Nom de famille",
    logout: "Déconnexion",
    period: "Période :",
    product: "Produit",
    save: "Enregistrer",
    saved: "Enregistré",
    saving: "Enregistrement…",
    score: "Score",
    search: "Rechercher",
    select: "Select",
    tipOfTheDay: "Conseil du jour",
    tipHydration: "Buvez un verre d'eau à chaque repas pour atteindre plus facilement votre objectif quotidien.",
    today: "Aujourd'hui",
  },

  goal: {
    current: "Objectif actuel",
  },

  goalDescriptions: {
    lose: "Vous souhaitez perdre du poids progressivement et vivre plus sainement.",
    maintain: "Vous souhaitez maintenir votre poids actuel.",
    gain: "Vous souhaitez prendre du poids progressivement.",
    holiday: "Se détendre sans objectif et suivre ses habitudes.",
  },

  goals: {
    lose: "Perdre du poids",
    maintain: "Maintenir son poids",
    gain: "Prendre du poids",
    holiday: "Mode vacances",
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

  lifestyle: {
    title: "Mode de vie",
    activityLevel: "Niveau d'activité",

    sedentary: {
      label: "Peu actif",
      desc: "Travail principalement assis, peu de mouvement (par ex. moins de 5000 pas par jour).",
    },

    light: {
      label: "Légèrement actif",
      desc: "Travail assis mais avec des mouvements réguliers (par ex. 5000–8000 pas ou activité occasionnelle).",
    },

    moderate: {
      label: "Modérément actif",
      desc: "Journées actives avec beaucoup de mouvement (par ex. 8000–12000 pas, sport ou travail physique).",
    },

    active: {
      label: "Actif",
      desc: "Beaucoup de mouvement quotidien, travail physique ou sport fréquent (généralement plus de 12000 pas).",
    },

    veryActive: {
      label: "Très actif",
      desc: "Travail physique intense, entraînement intensif ou sport de haut niveau.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    drink: "Boisson",
    hydration: "Hydratation",
    nutrition: "Nutrition",
    activity: "Activités",
    weight: "Poids",
    handbook: "Guide",
  },

  nutrition: {
    title: "Nutrition",

    addFood: "Alimentation",
    amount: "Quantité",
    carbs: "Glucides",
    energy: "Énergie",
    fat: "Lipides",
    fiber: "Fibres",
    goal: "Limite quotidienne",
    loading: "Chargement de la nutrition…",
    preparation: "Préparation",
    protein: "Protéines",
    salt: "Sel",
    searchProduct: "Rechercher un produit...",
    sugar: "Sucre",
    unit: "Unité",

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

  profile: {
    healthProfile: "Profil de santé",
    birthDate: "Date de naissance",

    gender: {
      description: "Nous utilisons le sexe biologique pour des calculs précis de santé et d'énergie.",
      female: "Femme",
      label: "Sexe",
      male: "Homme",
    },

    height: "Taille",
    weight: "Poids",
  },

  settings: {
    title: "Paramètres",
  },

  subscription: {
    title: "Abonnement",
    loading: "Chargement...",

    currentPlan: "Abonnement actuel",
    status: "Statut",
    renew: "Prochain renouvellement",

    actions: {
      change: "Modifier l'abonnement",
      manage: "Gérer l'abonnement",
    },

    plans: {
      free: "Free",
      premium: "Premium",
      pro: "Pro",
    },

    pricing: {
      premium: "€ 4,95 / mois",
      pro: "€ 8,95 / mois",
    },
  },
  
  units: {
    cm: "cm",
    kg: "kg",
  },

  weight: {
    title: "Poids",

    addWeight: "Poids",
    average: "Moyenne",
    bmi: "IMC",
    editWeight: "Mettre à jour le poids",
    estimatedTargetDate: "Date estimée de l’objectif vers",
    gained: "Poids augmenté",
    healthy: "Poids normal",
    hideBMI: "Masquer l'IMC",
    loading: "Chargement du poids…",
    loadingHistory: "Chargement de l'historique du poids…",
    lost: "Poids diminué",
    obesity: "Obésité",
    overweight: "Surpoids",
    showBMI: "Afficher l'IMC",
    stable: "Poids stable",
    targetWeight: "Poids cible",
    underweight: "Insuffisance pondérale",
  },

};

/* ───────────────── GERMAN ───────────────── */

const de = {

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

  common: {
    account: "Konto",
    add: "Hinzufügen",
    close: "Schließen",
    email: "E-Mail",
    favoriteLimitUpgrade: "Du hast dein Limit von {{limit}} Favoriten erreicht.\nUpgrade dein Konto, um mehr Favoriten hinzufügen zu können.",
    favorites: "Favoriten",
    firstName: "Vorname",
    goal: "Ziel",
    language: "Sprache",
    lastDays: "Letzte {{days}} Tage",
    lastName: "Nachname",
    logout: "Abmelden",
    period: "Zeitraum:",
    product: "Produkt",
    save: "Speichern",
    saved: "Gespeichert",
    saving: "Speichern…",
    score: "Score",
    search: "Suchen",
    select: "Select",
    tipOfTheDay: "Tipp des Tages",
    tipHydration: "Trinke zu jeder Mahlzeit ein Glas Wasser, um dein Tagesziel leichter zu erreichen.",
    today: "Heute",
  },

  goal: {
    current: "Aktuelles Ziel",
  },

  goalDescriptions: {
    lose: "Du möchtest schrittweise abnehmen und gesünder leben.",
    maintain: "Du möchtest dein Gewicht und deinen Lebensstil beibehalten.",
    gain: "Du möchtest schrittweise zunehmen und gesünder leben.",
    holiday: "Entspannt ohne Ziel, nur deine Gewohnheiten verfolgen.",
  },

  goals: {
    lose: "Abnehmen",
    maintain: "Gewicht halten",
    gain: "Zunehmen",
    holiday: "Urlaubsmodus",
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

  lifestyle: {
    title: "Lebensstil",
    activityLevel: "Aktivitätsniveau",

    sedentary: {
      label: "Wenig aktiv",
      desc: "Überwiegend sitzende Tätigkeit, wenig Bewegung (z. B. weniger als 5000 Schritte pro Tag).",
    },

    light: {
      label: "Leicht aktiv",
      desc: "Sitzende Tätigkeit, aber regelmäßige Bewegung (z. B. 5000–8000 Schritte oder gelegentlich Sport).",
    },

    moderate: {
      label: "Mäßig aktiv",
      desc: "Aktive Tage mit viel Bewegung (z. B. 8000–12000 Schritte, Sport oder körperliche Arbeit).",
    },

    active: {
      label: "Aktiv",
      desc: "Viel tägliche Bewegung, körperliche Arbeit oder häufig Sport (meist mehr als 12000 Schritte).",
    },

    veryActive: {
      label: "Sehr aktiv",
      desc: "Schwere körperliche Arbeit, intensives Training oder Leistungssport.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    drink: "Getränk",
    hydration: "Hydration",
    nutrition: "Ernährung",
    activity: "Aktivitäten",
    weight: "Gewicht",
    handbook: "Handbuch",
  },

  nutrition: {
    title: "Ernährung",

    addFood: "Ernährung",
    amount: "Menge",
    carbs: "Kohlenhydrate",
    energy: "Energie",
    fat: "Fette",
    fiber: "Ballaststoffe",
    goal: "Tageslimit",
    loading: "Lade Ernährungsdaten…",
    preparation: "Zubereitung",
    protein: "Eiweiß",
    salt: "Salz",
    searchProduct: "Produkt suchen...",
    sugar: "Zucker",
    unit: "Einheit",

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

  profile: {
    healthProfile: "Gesundheitsprofil",
    birthDate: "Geburtsdatum",

    gender: {
      description: "Für genaue Gesundheits- und Energieberechnungen verwenden wir das biologische Geschlecht.",
      female: "Weiblich",
      label: "Geschlecht",
      male: "Männlich",
    },

    height: "Größe",
    weight: "Gewicht",
  },

  settings: {
    title: "Einstellungen",
  },

  subscription: {
    title: "Abonnement",
    loading: "Laden...",

    currentPlan: "Aktuelles Abonnement",
    status: "Status",
    renew: "Nächste Verlängerung",

    actions: {
      change: "Abonnement ändern",
      manage: "Abonnement verwalten",
    },

    plans: {
      free: "Free",
      premium: "Premium",
      pro: "Pro",
    },

    pricing: {
      premium: "€ 4,95 / Monat",
      pro: "€ 8,95 / Monat",
    },
  },

  units: {
    cm: "cm",
    kg: "kg",
  },

  weight: {
    title: "Gewicht",

    addWeight: "Gewicht",
    average: "Durchschnitt",
    bmi: "BMI",
    editWeight: "Gewicht aktualisieren",
    estimatedTargetDate: "Voraussichtliches Zielgewicht-Datum etwa",
    gained: "Gewicht gestiegen",
    healthy: "Normalgewicht",
    hideBMI: "BMI ausblenden",
    loading: "Gewicht wird geladen…",
    loadingHistory: "Gewichtsverlauf wird geladen…",
    lost: "Gewicht gesunken",
    obesity: "Adipositas",
    overweight: "Übergewicht",
    showBMI: "BMI anzeigen",
    stable: "Gewicht stabil",
    targetWeight: "Zielgewicht",
    underweight: "Untergewicht",
  },

};

/* ───────────────── POLISH ───────────────── */

const pl = {

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

  common: {
    account: "Konto",
    add: "Dodaj",
    close: "Zamknij",
    email: "E-mail",
    favoriteLimitUpgrade: "Osiągnąłeś limit {{limit}} ulubionych.\nUlepsz konto, aby móc dodać więcej ulubionych.",
    favorites: "Ulubione",
    firstName: "Imię",
    goal: "Cel",
    language: "Język",
    lastDays: "Ostatnie {{days}} dni",
    lastName: "Nazwisko",
    logout: "Wyloguj",
    period: "Okres:",
    product: "Produkt",
    save: "Zapisz",
    saved: "Zapisano",
    saving: "Zapisywanie…",
    score: "Wynik",
    search: "Szukaj",
    select: "Select",
    tipOfTheDay: "Wskazówka dnia",
    tipHydration: "Pij szklankę wody do każdego posiłku, aby łatwiej osiągnąć swój dzienny cel.",
    today: "Dziś",
  },

  goal: {
    current: "Obecny cel",
  },

  goalDescriptions: {
    lose: "Chcesz stopniowo schudnąć i prowadzić zdrowszy tryb życia.",
    maintain: "Chcesz utrzymać obecną wagę i styl życia.",
    gain: "Chcesz stopniowo przytyć i prowadzić zdrowszy tryb życia.",
    holiday: "Zrelaksuj się bez celu i śledź swoje nawyki.",
  },

  goals: {
    lose: "Schudnąć",
    maintain: "Utrzymać wagę",
    gain: "Przytyć",
    holiday: "Tryb wakacyjny",
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

  lifestyle: {
    title: "Styl życia",
    activityLevel: "Poziom aktywności",

    sedentary: {
      label: "Mało aktywny",
      desc: "Praca głównie siedząca, mało ruchu (np. mniej niż 5000 kroków dziennie).",
    },

    light: {
      label: "Lekko aktywny",
      desc: "Praca siedząca, ale regularny ruch (np. 5000–8000 kroków lub okazjonalne ćwiczenia).",
    },

    moderate: {
      label: "Umiarkowanie aktywny",
      desc: "Aktywne dni z dużą ilością ruchu (np. 8000–12000 kroków, sport lub praca fizyczna).",
    },

    active: {
      label: "Aktywny",
      desc: "Dużo codziennego ruchu, praca fizyczna lub częsty sport (zwykle ponad 12000 kroków).",
    },

    veryActive: {
      label: "Bardzo aktywny",
      desc: "Ciężka praca fizyczna, intensywny trening lub sport wyczynowy.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    drink: "Napój",
    hydration: "Nawodnienie",
    nutrition: "Odżywianie",
    activity: "Aktywności",
    weight: "Waga",
    handbook: "Poradnik",
  },

  nutrition: {
    title: "Odżywianie",

    addFood: "Jedzenie",
    amount: "Ilość",
    carbs: "Węglowodany",
    energy: "Energia",
    fat: "Tłuszcze",
    fiber: "Błonnik",
    goal: "Limit dzienny",
    loading: "Ładowanie danych o odżywianiu…",
    preparation: "Przygotowanie",
    protein: "Białko",
    salt: "Sól",
    searchProduct: "Szukaj produktu...",
    sugar: "Cukier",
    unit: "Jednostka",

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

  profile: {
    healthProfile: "Profil zdrowotny",
    birthDate: "Data urodzenia",

    gender: {
      description: "Do dokładnych obliczeń zdrowia i energii używamy płci biologicznej.",
      female: "Kobieta",
      label: "Płeć",
      male: "Mężczyzna",
    },

    height: "Wzrost",
    weight: "Waga",
  },

  settings: {
    title: "Ustawienia",
  },

  subscription: {
    title: "Subskrypcja",
    loading: "Ładowanie...",

    currentPlan: "Obecny plan",
    status: "Status",
    renew: "Następne odnowienie",

    actions: {
      change: "Zmień subskrypcję",
      manage: "Zarządzaj subskrypcją",
    },

    plans: {
      free: "Free",
      premium: "Premium",
      pro: "Pro",
    },

    pricing: {
      premium: "€ 4,95 / miesiąc",
      pro: "€ 8,95 / miesiąc",
    },
  },

  units: {
    cm: "cm",
    kg: "kg",
  },

  weight: {
    title: "Waga",

    addWeight: "Waga",
    average: "Średnia",
    bmi: "BMI",
    editWeight: "Zaktualizuj wagę",
    estimatedTargetDate: "Przewidywana data osiągnięcia celu około",
    gained: "Waga wzrosła",
    healthy: "Prawidłowa waga",
    hideBMI: "Ukryj BMI",
    loading: "Ładowanie wagi…",
    loadingHistory: "Ładowanie historii wagi…",
    lost: "Waga spadła",
    obesity: "Otyłość",
    overweight: "Nadwaga",
    showBMI: "Pokaż BMI",
    stable: "Waga stabilna",
    targetWeight: "Docelowa waga",
    underweight: "Niedowaga",
  },

};

export const uiText: Record<Lang, any> = { en, nl, fr, de, pl };

export function getUIText(lang: Lang) {
  const t = uiText[lang];
  t.__lang = lang;
  return t;
}
