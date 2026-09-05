// app/lib/uiText.ts

import { Lang } from "./useLang";

/* ───────────────── ENGLISH ───────────────── */

const en = {

  auth: {
    accountTitle: "Create account", onboardingTitle: "Complete your profile", personalTitle: "Personal details", bodyTitle: "Body details", goalTitle: "Your goals",
    registrationLanguage: "Language", selectLanguage: "Select your language",
    firstName: "First name", lastName: "Last name", email: "Email address", password: "Password", confirmPassword: "Confirm password", passwordMinimum: "Use at least {{minimum}} characters.", loginTitle: "Log in", login: "Log in", loggingIn: "Logging in…", loginFailure: { title: "Unable to log in.", guidance: "Check your details and try again." },
    registrationErrors: { languageInvalid: "Select a language.", firstNameRequired: "Enter your first name.", lastNameRequired: "Enter your last name.", emailRequired: "Enter your email address.", emailInvalid: "Enter a valid email address.", passwordRequired: "Enter a password.", passwordTooShort: "Use at least {{minimum}} characters.", confirmationRequired: "Confirm your password.", passwordMismatch: "The passwords do not match.", countryInvalid: "Select a valid country." },
    residenceCountry: "Country of residence", foodRegion: "Food region", selectCountry: "Select a country",
    loadingCountries: "Loading countries…", countryLoadError: "Countries could not be loaded. Please try again.",
    requiredFields: "Complete all required fields.", registrationFailure: "We couldn’t create your account. Please try again.", next: "Next", registering: "Creating account…",
    checkEmailTitle: "Check your email", checkEmailMessage: "We sent a confirmation link to {{email}}.",
    confirmationSpamGuidance: "Didn't receive an email? Check your spam folder.", confirmationResend: "Resend confirmation email", confirmationResending: "Sending…",
    confirmationResendSuccess: "A new confirmation email has been sent.", confirmationResendCooldown: "Try again in {{seconds}} seconds.", confirmationResendFailure: "We couldn't send the confirmation email. Please try again.",
    confirmationInvalidTitle: "Confirmation link no longer valid", confirmationInvalidMessage: "This confirmation link is invalid, expired or has already been used.",
    confirmationUnavailableTitle: "Confirmation temporarily unavailable", confirmationUnavailableMessage: "We couldn't complete the confirmation. Please try again or request a new email.",
    confirmationRecoveryGuidance: "Enter your email address to request a new confirmation email.", confirmationRecoverySubmit: "Request new confirmation email", confirmationRecoverySubmitting: "Sending…",
    confirmationRecoveryNeutralResult: "Check your email. If confirmation is required for this email address, you will receive a new confirmation email.",
    gender: "Gender", birthdate: "Date of birth", male: "Male", female: "Female", other: "Other",
    calculationNote: "In the next step, choose how health calculations should be performed.",
    height: "Height (cm)", weight: "Weight (kg)", calculationBasedOn: "Base calculations on",
    noUser: "No authenticated user found.", back: "Back", saving: "Saving…",
    activityLevel: "Activity level", goalQuestion: "What is your goal?", finish: "Go to dashboard", finishing: "Setting up…",
    sedentary: "Low activity: Mostly seated work and little movement.", light: "Lightly active: Seated work with regular movement.",
    moderate: "Moderately active: Active days, exercise or physical work.", active: "Active: A lot of daily movement or frequent exercise.",
    veryActive: "Very active: Heavy physical work or intensive training.",
    loadingOnboarding: "Loading onboarding…", onboardingError: "Onboarding could not be loaded. Please try again.", retry: "Try again",
    regionTitle: "Country and food region", residenceDescription: "Your country of residence.", foodRegionDescription: "The food market you want to use.", unsupportedFoodRegion: "For this region, we currently use international product results. Regional product data for {{country}} will be added at a later stage.",
    forgotPasswordTitle: "Forgot password?", forgotPasswordSubmit: "Send reset link", forgotPasswordSubmitting: "Sending…",
    forgotPasswordSent: "If an account exists for this email address, you will receive password reset instructions.", backToLogin: "Back to login",
    forgotPasswordUnavailable: "We couldn’t send a reset email. Please try again.", forgotPasswordCooldown: "Try again in {{seconds}} seconds.",
    resetPasswordTitle: "Set a new password", resetPasswordNew: "New password", resetPasswordConfirm: "Confirm new password", resetPasswordSubmit: "Save password", resetPasswordSubmitting: "Saving…",
    resetPasswordInvalid: "This reset link is invalid.", resetPasswordExpired: "This reset link is invalid, expired or has already been used.", resetPasswordVerificationUnavailable: "We couldn’t verify this reset link. Please try again.", resetPasswordUnavailable: "We couldn’t reset your password. Request a new reset email and try again.", resetPasswordUnknown: "We couldn’t confirm whether your password was reset. For your security, do not try this link again. Request a new reset email.", resetPasswordCleanupRequired: "Your password was reset, but we couldn’t safely complete sign-out. Try the secure cleanup again.", resetPasswordRetryCleanup: "Retry secure sign-out", resetPasswordRequestNew: "Request a new reset email", passwordResetNotice: "Your password has been reset. Log in with your new password.",
    sessionExpired: "Your session has expired. Log in again to continue.", logoutFailure: "We couldn’t log you out. Please try again.",
  },

  activity: {
    title: "Activity",

    addActivity: "Activity",
    goal: "Daily goal",
    minutes: "min",
    loading: "Loading activity…",


    whichActivity: "Which activity?",
    howLong: "How long?",
    customMinutesLabel: "Custom duration in minutes",
    customMinutesPlaceholder: "Or enter minutes manually",
    burnPreview: "Estimated burn:",
    summary: "Summary",
    calories: "Calories",
    todayOverview: "Today's activity",
    activityLabel: "Activity",
    duration: "Duration",
    total: "Total",
    emptyToday: "No activity logged today yet.",
    loadError: "Activity could not be loaded.",
    saveError: "Activity could not be saved. Please try again.",
    retry: "Try again",

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
    category: "Category",
    close: "Close",
    email: "Email",
    favoriteActiveNotice: "You have {{total}} favorites. Your current plan keeps {{limit}} active.",
    favoriteLimitUpgrade: "You have reached your limit of {{limit}} favorites.\nUpgrade your account to add more favorites.",
    favorites: "Favorites",
    filters: "Filters",
    firstName: "First name",
    goal: "Goal",
    grade: "FitLifeScore",
    language: "Language",
    lastDays: "Last {{days}} days",
    lastName: "Last name",
    logout: "Logout",
    period: "Period:",
    premiumFeature: "This feature is available with Premium, Pro and Coach.",
    product: "Product",
    noProductsForFilters: "No products found for this search and filter combination.",
    resetFilters: "Reset filters",
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
    title: "Profile",
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
    unavailable: "Weight data is not available yet.",
  },

};

/* ───────────────── DUTCH ───────────────── */

const nl = {

  auth: {
    accountTitle: "Account aanmaken", onboardingTitle: "Maak je profiel compleet", personalTitle: "Persoonlijke gegevens", bodyTitle: "Lichaamsgegevens", goalTitle: "Je doelen",
    registrationLanguage: "Taal", selectLanguage: "Kies je taal",
    firstName: "Voornaam", lastName: "Achternaam", email: "E-mailadres", password: "Wachtwoord", confirmPassword: "Bevestig wachtwoord", passwordMinimum: "Gebruik minimaal {{minimum}} tekens.", loginTitle: "Inloggen", login: "Inloggen", loggingIn: "Inloggen…", loginFailure: { title: "Inloggen is niet gelukt.", guidance: "Controleer je gegevens en probeer het opnieuw." },
    registrationErrors: { languageInvalid: "Kies een taal.", firstNameRequired: "Vul je voornaam in.", lastNameRequired: "Vul je achternaam in.", emailRequired: "Vul je e-mailadres in.", emailInvalid: "Vul een geldig e-mailadres in.", passwordRequired: "Vul een wachtwoord in.", passwordTooShort: "Gebruik minimaal {{minimum}} tekens.", confirmationRequired: "Bevestig je wachtwoord.", passwordMismatch: "De wachtwoorden komen niet overeen.", countryInvalid: "Kies een geldig land." },
    residenceCountry: "Woonland", foodRegion: "Voedselregio", selectCountry: "Selecteer een land",
    loadingCountries: "Landen laden…", countryLoadError: "Landen konden niet worden geladen. Probeer het opnieuw.",
    requiredFields: "Vul alle verplichte velden in.", registrationFailure: "We konden je account niet aanmaken. Probeer het opnieuw.", next: "Volgende", registering: "Account aanmaken…",
    checkEmailTitle: "Controleer je e-mail", checkEmailMessage: "We hebben een bevestigingslink gestuurd naar {{email}}.",
    confirmationSpamGuidance: "Geen e-mail ontvangen? Controleer je spamfolder.", confirmationResend: "Bevestigingsmail opnieuw versturen", confirmationResending: "Versturen…",
    confirmationResendSuccess: "Er is een nieuwe bevestigingsmail verstuurd.", confirmationResendCooldown: "Probeer het over {{seconds}} seconden opnieuw.", confirmationResendFailure: "We konden de bevestigingsmail niet versturen. Probeer het opnieuw.",
    confirmationInvalidTitle: "Bevestigingslink niet meer geldig", confirmationInvalidMessage: "Deze bevestigingslink is ongeldig, verlopen of al gebruikt.",
    confirmationUnavailableTitle: "Bevestiging tijdelijk niet beschikbaar", confirmationUnavailableMessage: "We konden de bevestiging niet afronden. Probeer het opnieuw of vraag een nieuwe e-mail aan.",
    confirmationRecoveryGuidance: "Vul je e-mailadres in om een nieuwe bevestigingsmail aan te vragen.", confirmationRecoverySubmit: "Nieuwe bevestigingsmail aanvragen", confirmationRecoverySubmitting: "Versturen…",
    confirmationRecoveryNeutralResult: "Controleer je e-mail. Als er voor dit e-mailadres een bevestiging nodig is, ontvang je een nieuwe bevestigingsmail.",
    gender: "Geslacht", birthdate: "Geboortedatum", male: "Man", female: "Vrouw", other: "Anders",
    calculationNote: "Kies in de volgende stap hoe gezondheidsberekeningen moeten worden uitgevoerd.",
    height: "Lengte (cm)", weight: "Gewicht (kg)", calculationBasedOn: "Berekening baseren op",
    noUser: "Geen ingelogde gebruiker gevonden.", back: "Terug", saving: "Opslaan…",
    activityLevel: "Activiteitsniveau", goalQuestion: "Wat is je doel?", finish: "Naar dashboard", finishing: "Instellen…",
    sedentary: "Weinig actief: Overwegend zittend werk en weinig beweging.", light: "Licht actief: Zittend werk met regelmatige beweging.",
    moderate: "Gemiddeld actief: Actieve dagen, sport of fysiek werk.", active: "Actief: Veel dagelijkse beweging of vaak sporten.",
    veryActive: "Zeer actief: Zwaar fysiek werk of intensieve training.",
    loadingOnboarding: "Onboarding laden…", onboardingError: "Onboarding kon niet worden geladen. Probeer het opnieuw.", retry: "Opnieuw proberen",
    regionTitle: "Land en voedselregio", residenceDescription: "Het land waar je woont.", foodRegionDescription: "De voedingsmarkt die je wilt gebruiken.", unsupportedFoodRegion: "Voor deze regio gebruiken we momenteel internationale productresultaten. Regionale productdata voor {{country}} zullen in een later stadium worden toegevoegd.",
    forgotPasswordTitle: "Wachtwoord vergeten?", forgotPasswordSubmit: "Reset-link sturen", forgotPasswordSubmitting: "Versturen…",
    forgotPasswordSent: "Als er een account voor dit e-mailadres bestaat, ontvang je instructies om je wachtwoord te resetten.", backToLogin: "Terug naar inloggen",
    forgotPasswordUnavailable: "We konden geen resetmail versturen. Probeer het opnieuw.", forgotPasswordCooldown: "Probeer het over {{seconds}} seconden opnieuw.",
    resetPasswordTitle: "Nieuw wachtwoord instellen", resetPasswordNew: "Nieuw wachtwoord", resetPasswordConfirm: "Bevestig nieuw wachtwoord", resetPasswordSubmit: "Wachtwoord opslaan", resetPasswordSubmitting: "Opslaan…",
    resetPasswordInvalid: "Deze resetlink is ongeldig.", resetPasswordExpired: "Deze resetlink is ongeldig, verlopen of al gebruikt.", resetPasswordVerificationUnavailable: "We konden deze resetlink niet controleren. Probeer het opnieuw.", resetPasswordUnavailable: "We konden je wachtwoord niet resetten. Vraag een nieuwe resetmail aan en probeer het opnieuw.", resetPasswordUnknown: "We konden niet bevestigen of je wachtwoord is gereset. Gebruik deze link voor je veiligheid niet opnieuw. Vraag een nieuwe resetmail aan.", resetPasswordCleanupRequired: "Je wachtwoord is gereset, maar we konden het uitloggen niet veilig afronden. Probeer de veilige opschoning opnieuw.", resetPasswordRetryCleanup: "Veilig uitloggen opnieuw proberen", resetPasswordRequestNew: "Nieuwe resetmail aanvragen", passwordResetNotice: "Je wachtwoord is opnieuw ingesteld. Log in met je nieuwe wachtwoord.",
    sessionExpired: "Je sessie is verlopen. Log opnieuw in om verder te gaan.", logoutFailure: "We konden je niet uitloggen. Probeer het opnieuw.",
  },

  activity: {
    title: "Activiteiten",

    addActivity: "Activiteit",
    goal: "Dagdoel",
    minutes: "min",
    loading: "Activiteiten laden…",

    whichActivity: "Welke activiteit?",
    howLong: "Hoe lang?",
    customMinutesLabel: "Aangepaste duur in minuten",
    customMinutesPlaceholder: "Of vul zelf minuten in",
    burnPreview: "Verbranding:",
    summary: "Samenvatting",
    calories: "Calorieën",
    todayOverview: "Vandaag bewogen",
    activityLabel: "Activiteit",
    duration: "Duur",
    total: "Totaal",
    emptyToday: "Vandaag zijn nog geen activiteiten geregistreerd.",
    loadError: "De activiteiten konden niet worden geladen.",
    saveError: "De activiteit kon niet worden opgeslagen. Probeer het opnieuw.",
    retry: "Opnieuw proberen",

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
    category: "Categorie",
    close: "Sluiten",
    email: "E-mail",
    favoriteActiveNotice: "Je hebt {{total}} favorieten. In je huidige abonnement zijn er {{limit}} actief.",
    favoriteLimitUpgrade: "Je hebt je limiet van {{limit}} favorieten bereikt.\nUpgrade je account om meer favorieten toe te kunnen voegen.",
    favorites: "Favorieten",
    filters: "Filters",
    firstName: "Voornaam",
    goal: "Doel",
    grade: "FitLifeScore",
    language: "Taal",
    lastDays: "Laatste {{days}} dagen",
    lastName: "Achternaam",
    logout: "Uitloggen",
    period: "Periode:",
    premiumFeature: "Deze functie is beschikbaar met Premium, Pro en Coach.",
    product: "Product",
    noProductsForFilters: "Geen producten gevonden voor deze zoekopdracht en filtercombinatie.",
    resetFilters: "Filters wissen",
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
    title: "Profiel",
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
    unavailable: "Gewichtsgegevens zijn nog niet beschikbaar.",
  },

};

/* ───────────────── FRENCH ───────────────── */

const fr = {

  auth: {
    accountTitle: "Créer un compte", onboardingTitle: "Complétez votre profil", personalTitle: "Données personnelles", bodyTitle: "Données corporelles", goalTitle: "Vos objectifs",
    registrationLanguage: "Langue", selectLanguage: "Choisissez votre langue",
    firstName: "Prénom", lastName: "Nom", email: "Adresse e-mail", password: "Mot de passe", confirmPassword: "Confirmer le mot de passe", passwordMinimum: "Utilisez au moins {{minimum}} caractères.", loginTitle: "Se connecter", login: "Se connecter", loggingIn: "Connexion…", loginFailure: { title: "La connexion a échoué.", guidance: "Vérifiez vos informations et réessayez." },
    registrationErrors: { languageInvalid: "Sélectionnez une langue.", firstNameRequired: "Saisissez votre prénom.", lastNameRequired: "Saisissez votre nom.", emailRequired: "Saisissez votre adresse e-mail.", emailInvalid: "Saisissez une adresse e-mail valide.", passwordRequired: "Saisissez un mot de passe.", passwordTooShort: "Utilisez au moins {{minimum}} caractères.", confirmationRequired: "Confirmez votre mot de passe.", passwordMismatch: "Les mots de passe ne correspondent pas.", countryInvalid: "Sélectionnez un pays valide." },
    residenceCountry: "Pays de résidence", foodRegion: "Région alimentaire", selectCountry: "Sélectionnez un pays",
    loadingCountries: "Chargement des pays…", countryLoadError: "Impossible de charger les pays. Réessayez.",
    requiredFields: "Remplissez tous les champs obligatoires.", registrationFailure: "Nous n’avons pas pu créer votre compte. Veuillez réessayer.", next: "Suivant", registering: "Création du compte…",
    checkEmailTitle: "Vérifiez votre e-mail", checkEmailMessage: "Nous avons envoyé un lien de confirmation à {{email}}.",
    confirmationSpamGuidance: "Vous n’avez pas reçu d’e-mail ? Vérifiez votre dossier de courriers indésirables.", confirmationResend: "Renvoyer l’e-mail de confirmation", confirmationResending: "Envoi…",
    confirmationResendSuccess: "Un nouvel e-mail de confirmation a été envoyé.", confirmationResendCooldown: "Réessayez dans {{seconds}} secondes.", confirmationResendFailure: "Nous n’avons pas pu envoyer l’e-mail de confirmation. Veuillez réessayer.",
    confirmationInvalidTitle: "Lien de confirmation non valide", confirmationInvalidMessage: "Ce lien de confirmation est incorrect, expiré ou a déjà été utilisé.",
    confirmationUnavailableTitle: "Confirmation temporairement indisponible", confirmationUnavailableMessage: "Nous n’avons pas pu terminer la confirmation. Réessayez ou demandez un nouvel e-mail.",
    confirmationRecoveryGuidance: "Saisissez votre adresse e-mail pour demander un nouvel e-mail de confirmation.", confirmationRecoverySubmit: "Demander un nouvel e-mail de confirmation", confirmationRecoverySubmitting: "Envoi…",
    confirmationRecoveryNeutralResult: "Vérifiez votre e-mail. Si une confirmation est nécessaire pour cette adresse, vous recevrez un nouvel e-mail de confirmation.",
    gender: "Genre", birthdate: "Date de naissance", male: "Homme", female: "Femme", other: "Autre",
    calculationNote: "À l’étape suivante, choisissez comment effectuer les calculs de santé.",
    height: "Taille (cm)", weight: "Poids (kg)", calculationBasedOn: "Baser les calculs sur",
    noUser: "Aucun utilisateur connecté trouvé.", back: "Retour", saving: "Enregistrement…",
    activityLevel: "Niveau d’activité", goalQuestion: "Quel est votre objectif ?", finish: "Aller au tableau de bord", finishing: "Configuration…",
    sedentary: "Peu actif : Travail principalement assis et peu de mouvement.", light: "Légèrement actif : Travail assis avec une activité régulière.",
    moderate: "Modérément actif : Journées actives, sport ou travail physique.", active: "Actif : Beaucoup de mouvement quotidien ou sport fréquent.",
    veryActive: "Très actif : Travail physique lourd ou entraînement intensif.",
    loadingOnboarding: "Chargement de l’intégration…", onboardingError: "Impossible de charger l’intégration. Réessayez.", retry: "Réessayer",
    regionTitle: "Pays et région alimentaire", residenceDescription: "Votre pays de résidence.", foodRegionDescription: "Le marché alimentaire que vous souhaitez utiliser.", unsupportedFoodRegion: "Pour cette région, nous utilisons actuellement les résultats internationaux. Les données régionales sur les produits pour {{country}} seront ajoutées ultérieurement.",
    forgotPasswordTitle: "Mot de passe oublié ?", forgotPasswordSubmit: "Envoyer le lien de réinitialisation", forgotPasswordSubmitting: "Envoi…",
    forgotPasswordSent: "Si un compte existe pour cette adresse e-mail, vous recevrez des instructions pour réinitialiser votre mot de passe.", backToLogin: "Retour à la connexion",
    forgotPasswordUnavailable: "Nous n’avons pas pu envoyer l’e-mail de réinitialisation. Veuillez réessayer.", forgotPasswordCooldown: "Réessayez dans {{seconds}} secondes.",
    resetPasswordTitle: "Définir un nouveau mot de passe", resetPasswordNew: "Nouveau mot de passe", resetPasswordConfirm: "Confirmer le nouveau mot de passe", resetPasswordSubmit: "Enregistrer le mot de passe", resetPasswordSubmitting: "Enregistrement…",
    resetPasswordInvalid: "Ce lien de réinitialisation n’est pas valide.", resetPasswordExpired: "Ce lien de réinitialisation est incorrect, expiré ou a déjà été utilisé.", resetPasswordVerificationUnavailable: "Nous n’avons pas pu vérifier ce lien de réinitialisation. Veuillez réessayer.", resetPasswordUnavailable: "Nous n’avons pas pu réinitialiser votre mot de passe. Demandez un nouvel e-mail et réessayez.", resetPasswordUnknown: "Nous n’avons pas pu confirmer si votre mot de passe a été réinitialisé. Pour votre sécurité, ne réutilisez pas ce lien. Demandez un nouvel e-mail.", resetPasswordCleanupRequired: "Votre mot de passe a été réinitialisé, mais nous n’avons pas pu terminer la déconnexion en toute sécurité. Réessayez le nettoyage sécurisé.", resetPasswordRetryCleanup: "Réessayer la déconnexion sécurisée", resetPasswordRequestNew: "Demander un nouvel e-mail de réinitialisation", passwordResetNotice: "Votre mot de passe a été réinitialisé. Connectez-vous avec votre nouveau mot de passe.",
    sessionExpired: "Votre session a expiré. Reconnectez-vous pour continuer.", logoutFailure: "Nous n’avons pas pu vous déconnecter. Veuillez réessayer.",
  },

  activity: {
    title: "Activité quotidienne",

    addActivity: "Activité",
    goal: "Objectif quotidien",
    minutes: "min",
    loading: "Chargement de l'activité…",


    whichActivity: "Quelle activité ?",
    howLong: "Combien de temps ?",
    customMinutesLabel: "Durée personnalisée en minutes",
    customMinutesPlaceholder: "Ou saisissez les minutes manuellement",
    burnPreview: "Calories estimées :",
    summary: "Résumé",
    calories: "Calories",
    todayOverview: "Activité d'aujourd'hui",
    activityLabel: "Activité",
    duration: "Durée",
    total: "Total",
    emptyToday: "Aucune activité enregistrée aujourd'hui.",
    loadError: "Les activités n'ont pas pu être chargées.",
    saveError: "L'activité n'a pas pu être enregistrée. Réessayez.",
    retry: "Réessayer",

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
    category: "Catégorie",
    close: "Fermer",
    email: "E-mail",
    favoriteActiveNotice: "Vous avez {{total}} favoris. Votre abonnement actuel en garde {{limit}} actifs.",
    favoriteLimitUpgrade: "Vous avez atteint votre limite de {{limit}} favoris.\nMettez à niveau votre compte pour pouvoir ajouter plus de favoris.",
    favorites: "Favoris",
    filters: "Filtres",
    firstName: "Prénom",
    goal: "Doel",
    grade: "FitLifeScore",
    language: "Langue",
    lastDays: "Derniers {{days}} jours",
    lastName: "Nom de famille",
    logout: "Déconnexion",
    period: "Période :",
    premiumFeature: "Cette fonctionnalité est disponible avec Premium, Pro et Coach.",
    product: "Produit",
    noProductsForFilters: "Aucun produit trouvé pour cette recherche et cette combinaison de filtres.",
    resetFilters: "Réinitialiser les filtres",
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
    title: "Profil",
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
    unavailable: "Les données de poids ne sont pas encore disponibles.",
  },

};

/* ───────────────── GERMAN ───────────────── */

const de = {

  auth: {
    accountTitle: "Konto erstellen", onboardingTitle: "Vervollständige dein Profil", personalTitle: "Persönliche Daten", bodyTitle: "Körperdaten", goalTitle: "Deine Ziele",
    registrationLanguage: "Sprache", selectLanguage: "Wähle deine Sprache",
    firstName: "Vorname", lastName: "Nachname", email: "E-Mail-Adresse", password: "Passwort", confirmPassword: "Passwort bestätigen", passwordMinimum: "Verwende mindestens {{minimum}} Zeichen.", loginTitle: "Anmelden", login: "Anmelden", loggingIn: "Anmeldung…", loginFailure: { title: "Die Anmeldung ist fehlgeschlagen.", guidance: "Überprüfe deine Angaben und versuche es erneut." },
    registrationErrors: { languageInvalid: "Wähle eine Sprache aus.", firstNameRequired: "Gib deinen Vornamen ein.", lastNameRequired: "Gib deinen Nachnamen ein.", emailRequired: "Gib deine E-Mail-Adresse ein.", emailInvalid: "Gib eine gültige E-Mail-Adresse ein.", passwordRequired: "Gib ein Passwort ein.", passwordTooShort: "Verwende mindestens {{minimum}} Zeichen.", confirmationRequired: "Bestätige dein Passwort.", passwordMismatch: "Die Passwörter stimmen nicht überein.", countryInvalid: "Wähle ein gültiges Land aus." },
    residenceCountry: "Wohnland", foodRegion: "Lebensmittelregion", selectCountry: "Land auswählen",
    loadingCountries: "Länder werden geladen…", countryLoadError: "Länder konnten nicht geladen werden. Bitte erneut versuchen.",
    requiredFields: "Fülle alle Pflichtfelder aus.", registrationFailure: "Dein Konto konnte nicht erstellt werden. Bitte versuche es erneut.", next: "Weiter", registering: "Konto wird erstellt…",
    checkEmailTitle: "Prüfe deine E-Mail", checkEmailMessage: "Wir haben einen Bestätigungslink an {{email}} gesendet.",
    confirmationSpamGuidance: "Keine E-Mail erhalten? Prüfe deinen Spam-Ordner.", confirmationResend: "Bestätigungs-E-Mail erneut senden", confirmationResending: "Wird gesendet…",
    confirmationResendSuccess: "Eine neue Bestätigungs-E-Mail wurde gesendet.", confirmationResendCooldown: "Versuche es in {{seconds}} Sekunden erneut.", confirmationResendFailure: "Wir konnten die Bestätigungs-E-Mail nicht senden. Bitte versuche es erneut.",
    confirmationInvalidTitle: "Bestätigungslink nicht mehr gültig", confirmationInvalidMessage: "Dieser Bestätigungslink ist ungültig, abgelaufen oder wurde bereits verwendet.",
    confirmationUnavailableTitle: "Bestätigung vorübergehend nicht verfügbar", confirmationUnavailableMessage: "Wir konnten die Bestätigung nicht abschließen. Versuche es erneut oder fordere eine neue E-Mail an.",
    confirmationRecoveryGuidance: "Gib deine E-Mail-Adresse ein, um eine neue Bestätigungs-E-Mail anzufordern.", confirmationRecoverySubmit: "Neue Bestätigungs-E-Mail anfordern", confirmationRecoverySubmitting: "Wird gesendet…",
    confirmationRecoveryNeutralResult: "Prüfe deine E-Mail. Wenn für diese Adresse eine Bestätigung erforderlich ist, erhältst du eine neue Bestätigungs-E-Mail.",
    gender: "Geschlecht", birthdate: "Geburtsdatum", male: "Männlich", female: "Weiblich", other: "Andere",
    calculationNote: "Wähle im nächsten Schritt, wie Gesundheitsberechnungen durchgeführt werden sollen.",
    height: "Größe (cm)", weight: "Gewicht (kg)", calculationBasedOn: "Berechnungen basieren auf",
    noUser: "Kein angemeldeter Benutzer gefunden.", back: "Zurück", saving: "Speichern…",
    activityLevel: "Aktivitätsniveau", goalQuestion: "Was ist dein Ziel?", finish: "Zum Dashboard", finishing: "Einrichten…",
    sedentary: "Wenig aktiv: Überwiegend sitzende Arbeit und wenig Bewegung.", light: "Leicht aktiv: Sitzende Arbeit mit regelmäßiger Bewegung.",
    moderate: "Mäßig aktiv: Aktive Tage, Sport oder körperliche Arbeit.", active: "Aktiv: Viel tägliche Bewegung oder häufig Sport.",
    veryActive: "Sehr aktiv: Schwere körperliche Arbeit oder intensives Training.",
    loadingOnboarding: "Onboarding wird geladen…", onboardingError: "Onboarding konnte nicht geladen werden. Bitte erneut versuchen.", retry: "Erneut versuchen",
    regionTitle: "Land und Lebensmittelregion", residenceDescription: "Dein Wohnland.", foodRegionDescription: "Der Lebensmittelmarkt, den du verwenden möchtest.", unsupportedFoodRegion: "Für diese Region verwenden wir derzeit internationale Produktergebnisse. Regionale Produktdaten für {{country}} werden zu einem späteren Zeitpunkt ergänzt.",
    forgotPasswordTitle: "Passwort vergessen?", forgotPasswordSubmit: "Link zum Zurücksetzen senden", forgotPasswordSubmitting: "Wird gesendet…",
    forgotPasswordSent: "Wenn für diese E-Mail-Adresse ein Konto existiert, erhältst du Anweisungen zum Zurücksetzen deines Passworts.", backToLogin: "Zurück zur Anmeldung",
    forgotPasswordUnavailable: "Wir konnten keine E-Mail zum Zurücksetzen senden. Bitte versuche es erneut.", forgotPasswordCooldown: "Versuche es in {{seconds}} Sekunden erneut.",
    resetPasswordTitle: "Neues Passwort festlegen", resetPasswordNew: "Neues Passwort", resetPasswordConfirm: "Neues Passwort bestätigen", resetPasswordSubmit: "Passwort speichern", resetPasswordSubmitting: "Wird gespeichert…",
    resetPasswordInvalid: "Dieser Link zum Zurücksetzen ist ungültig.", resetPasswordExpired: "Dieser Link zum Zurücksetzen ist ungültig, abgelaufen oder wurde bereits verwendet.", resetPasswordVerificationUnavailable: "Wir konnten diesen Link zum Zurücksetzen nicht prüfen. Bitte versuche es erneut.", resetPasswordUnavailable: "Wir konnten dein Passwort nicht zurücksetzen. Fordere eine neue E-Mail an und versuche es erneut.", resetPasswordUnknown: "Wir konnten nicht bestätigen, ob dein Passwort zurückgesetzt wurde. Verwende diesen Link zu deiner Sicherheit nicht erneut. Fordere eine neue E-Mail an.", resetPasswordCleanupRequired: "Dein Passwort wurde zurückgesetzt, aber wir konnten die Abmeldung nicht sicher abschließen. Versuche die sichere Bereinigung erneut.", resetPasswordRetryCleanup: "Sichere Abmeldung erneut versuchen", resetPasswordRequestNew: "Neue E-Mail zum Zurücksetzen anfordern", passwordResetNotice: "Dein Passwort wurde zurückgesetzt. Melde dich mit deinem neuen Passwort an.",
    sessionExpired: "Deine Sitzung ist abgelaufen. Melde dich erneut an, um fortzufahren.", logoutFailure: "Du konntest nicht abgemeldet werden. Bitte versuche es erneut.",
  },

  activity: {
    title: "Tägliche Aktivität",

    addActivity: "Aktivität",
    goal: "Tagesziel",
    minutes: "Min",
    loading: "Lade Aktivitätsdaten…",


    whichActivity: "Welche Aktivität?",
    howLong: "Wie lange?",
    customMinutesLabel: "Benutzerdefinierte Dauer in Minuten",
    customMinutesPlaceholder: "Oder Minuten manuell eingeben",
    burnPreview: "Geschätzter Verbrauch:",
    summary: "Zusammenfassung",
    calories: "Kalorien",
    todayOverview: "Heutige Aktivität",
    activityLabel: "Aktivität",
    duration: "Dauer",
    total: "Gesamt",
    emptyToday: "Heute wurden noch keine Aktivitäten erfasst.",
    loadError: "Die Aktivitäten konnten nicht geladen werden.",
    saveError: "Die Aktivität konnte nicht gespeichert werden. Bitte versuche es erneut.",
    retry: "Erneut versuchen",

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
    category: "Kategorie",
    close: "Schließen",
    email: "E-Mail",
    favoriteActiveNotice: "Du hast {{total}} Favoriten. In deinem aktuellen Abo sind {{limit}} aktiv.",
    favoriteLimitUpgrade: "Du hast dein Limit von {{limit}} Favoriten erreicht.\nUpgrade dein Konto, um mehr Favoriten hinzufügen zu können.",
    favorites: "Favoriten",
    filters: "Filter",
    firstName: "Vorname",
    goal: "Ziel",
    grade: "FitLifeScore",
    language: "Sprache",
    lastDays: "Letzte {{days}} Tage",
    lastName: "Nachname",
    logout: "Abmelden",
    period: "Zeitraum:",
    premiumFeature: "Diese Funktion ist mit Premium, Pro und Coach verfügbar.",
    product: "Produkt",
    noProductsForFilters: "Keine Produkte für diese Suche und Filterkombination gefunden.",
    resetFilters: "Filter zurücksetzen",
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
    title: "Profil",
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
    unavailable: "Gewichtsdaten sind noch nicht verfügbar.",
  },

};

/* ───────────────── POLISH ───────────────── */

const pl = {

  auth: {
    accountTitle: "Utwórz konto", onboardingTitle: "Uzupełnij swój profil", personalTitle: "Dane osobowe", bodyTitle: "Dane ciała", goalTitle: "Twoje cele",
    registrationLanguage: "Język", selectLanguage: "Wybierz język",
    firstName: "Imię", lastName: "Nazwisko", email: "Adres e-mail", password: "Hasło", confirmPassword: "Potwierdź hasło", passwordMinimum: "Użyj co najmniej {{minimum}} znaków.", loginTitle: "Zaloguj się", login: "Zaloguj się", loggingIn: "Logowanie…", loginFailure: { title: "Logowanie nie powiodło się.", guidance: "Sprawdź swoje dane i spróbuj ponownie." },
    registrationErrors: { languageInvalid: "Wybierz język.", firstNameRequired: "Wpisz imię.", lastNameRequired: "Wpisz nazwisko.", emailRequired: "Wpisz adres e-mail.", emailInvalid: "Wpisz prawidłowy adres e-mail.", passwordRequired: "Wpisz hasło.", passwordTooShort: "Użyj co najmniej {{minimum}} znaków.", confirmationRequired: "Potwierdź hasło.", passwordMismatch: "Hasła nie są zgodne.", countryInvalid: "Wybierz prawidłowy kraj." },
    residenceCountry: "Kraj zamieszkania", foodRegion: "Region żywności", selectCountry: "Wybierz kraj",
    loadingCountries: "Ładowanie krajów…", countryLoadError: "Nie udało się załadować krajów. Spróbuj ponownie.",
    requiredFields: "Wypełnij wszystkie wymagane pola.", registrationFailure: "Nie udało się utworzyć konta. Spróbuj ponownie.", next: "Dalej", registering: "Tworzenie konta…",
    checkEmailTitle: "Sprawdź pocztę", checkEmailMessage: "Wysłaliśmy link potwierdzający na adres {{email}}.",
    confirmationSpamGuidance: "Nie masz wiadomości? Sprawdź folder ze spamem.", confirmationResend: "Wyślij ponownie wiadomość potwierdzającą", confirmationResending: "Wysyłanie…",
    confirmationResendSuccess: "Nowa wiadomość potwierdzająca została wysłana.", confirmationResendCooldown: "Spróbuj ponownie za {{seconds}} s.", confirmationResendFailure: "Nie udało się wysłać wiadomości potwierdzającej. Spróbuj ponownie.",
    confirmationInvalidTitle: "Link potwierdzający jest już nieważny", confirmationInvalidMessage: "Ten link potwierdzający jest nieprawidłowy, wygasł lub został już użyty.",
    confirmationUnavailableTitle: "Potwierdzenie jest chwilowo niedostępne", confirmationUnavailableMessage: "Nie udało się dokończyć potwierdzenia. Spróbuj ponownie lub poproś o nową wiadomość.",
    confirmationRecoveryGuidance: "Wpisz swój adres e-mail, aby poprosić o nową wiadomość potwierdzającą.", confirmationRecoverySubmit: "Poproś o nową wiadomość potwierdzającą", confirmationRecoverySubmitting: "Wysyłanie…",
    confirmationRecoveryNeutralResult: "Sprawdź pocztę. Jeśli ten adres wymaga potwierdzenia, otrzymasz nową wiadomość potwierdzającą.",
    gender: "Płeć", birthdate: "Data urodzenia", male: "Mężczyzna", female: "Kobieta", other: "Inna",
    calculationNote: "W następnym kroku wybierz sposób wykonywania obliczeń zdrowotnych.",
    height: "Wzrost (cm)", weight: "Masa ciała (kg)", calculationBasedOn: "Obliczenia na podstawie",
    noUser: "Nie znaleziono zalogowanego użytkownika.", back: "Wstecz", saving: "Zapisywanie…",
    activityLevel: "Poziom aktywności", goalQuestion: "Jaki jest twój cel?", finish: "Przejdź do panelu", finishing: "Konfigurowanie…",
    sedentary: "Mało aktywny: Głównie siedząca praca i mało ruchu.", light: "Lekko aktywny: Siedząca praca z regularnym ruchem.",
    moderate: "Umiarkowanie aktywny: Aktywne dni, sport lub praca fizyczna.", active: "Aktywny: Dużo codziennego ruchu lub częsty sport.",
    veryActive: "Bardzo aktywny: Ciężka praca fizyczna lub intensywny trening.",
    loadingOnboarding: "Ładowanie wdrażania…", onboardingError: "Nie udało się załadować wdrażania. Spróbuj ponownie.", retry: "Spróbuj ponownie",
    regionTitle: "Kraj i region żywności", residenceDescription: "Twój kraj zamieszkania.", foodRegionDescription: "Rynek żywności, którego chcesz używać.", unsupportedFoodRegion: "Dla tego regionu korzystamy obecnie z międzynarodowych wyników produktów. Regionalne dane produktów dla {{country}} zostaną dodane na późniejszym etapie.",
    forgotPasswordTitle: "Nie pamiętasz hasła?", forgotPasswordSubmit: "Wyślij link resetujący", forgotPasswordSubmitting: "Wysyłanie…",
    forgotPasswordSent: "Jeśli konto dla tego adresu e-mail istnieje, otrzymasz instrukcje resetowania hasła.", backToLogin: "Powrót do logowania",
    forgotPasswordUnavailable: "Nie udało się wysłać wiadomości resetującej. Spróbuj ponownie.", forgotPasswordCooldown: "Spróbuj ponownie za {{seconds}} s.",
    resetPasswordTitle: "Ustaw nowe hasło", resetPasswordNew: "Nowe hasło", resetPasswordConfirm: "Potwierdź nowe hasło", resetPasswordSubmit: "Zapisz hasło", resetPasswordSubmitting: "Zapisywanie…",
    resetPasswordInvalid: "Ten link resetujący jest nieprawidłowy.", resetPasswordExpired: "Ten link resetujący jest nieprawidłowy, wygasł lub został już użyty.", resetPasswordVerificationUnavailable: "Nie udało się zweryfikować tego linku resetującego. Spróbuj ponownie.", resetPasswordUnavailable: "Nie udało się zresetować hasła. Poproś o nową wiadomość resetującą i spróbuj ponownie.", resetPasswordUnknown: "Nie udało się potwierdzić, czy hasło zostało zresetowane. Ze względów bezpieczeństwa nie używaj ponownie tego linku. Poproś o nową wiadomość.", resetPasswordCleanupRequired: "Hasło zostało zresetowane, ale nie udało się bezpiecznie zakończyć wylogowania. Ponów bezpieczne czyszczenie.", resetPasswordRetryCleanup: "Ponów bezpieczne wylogowanie", resetPasswordRequestNew: "Poproś o nową wiadomość resetującą", passwordResetNotice: "Twoje hasło zostało zresetowane. Zaloguj się przy użyciu nowego hasła.",
    sessionExpired: "Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.", logoutFailure: "Nie udało się wylogować. Spróbuj ponownie.",
  },

  activity: {
    title: "Dzienne aktywności",

    addActivity: "Aktywność",
    goal: "Cel dzienny",
    minutes: "min",
    loading: "Ładowanie aktywności…",


    whichActivity: "Jaką aktywność?",
    howLong: "Jak długo?",
    customMinutesLabel: "Niestandardowy czas w minutach",
    customMinutesPlaceholder: "Lub wpisz liczbę minut ręcznie",
    burnPreview: "Szacowane spalanie:",
    summary: "Podsumowanie",
    calories: "Kalorie",
    todayOverview: "Dzisiejsza aktywność",
    activityLabel: "Aktywność",
    duration: "Czas trwania",
    total: "Suma",
    emptyToday: "Dzisiaj nie zarejestrowano jeszcze żadnej aktywności.",
    loadError: "Nie udało się załadować aktywności.",
    saveError: "Nie udało się zapisać aktywności. Spróbuj ponownie.",
    retry: "Spróbuj ponownie",

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
    category: "Kategoria",
    close: "Zamknij",
    email: "E-mail",
    favoriteActiveNotice: "Masz {{total}} ulubionych. W obecnym planie aktywne są {{limit}}.",
    favoriteLimitUpgrade: "Osiągnąłeś limit {{limit}} ulubionych.\nUlepsz konto, aby móc dodać więcej ulubionych.",
    favorites: "Ulubione",
    filters: "Filtry",
    firstName: "Imię",
    goal: "Cel",
    grade: "FitLifeScore",
    language: "Język",
    lastDays: "Ostatnie {{days}} dni",
    lastName: "Nazwisko",
    logout: "Wyloguj",
    period: "Okres:",
    premiumFeature: "Ta funkcja jest dostępna w planach Premium, Pro i Coach.",
    product: "Produkt",
    noProductsForFilters: "Nie znaleziono produktów dla tego wyszukiwania i filtrów.",
    resetFilters: "Wyczyść filtry",
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
    title: "Profil",
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
    unavailable: "Dane dotyczące wagi nie są jeszcze dostępne.",
  },

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uiText: Record<Lang, any> = { en, nl, fr, de, pl };

export function getUIText(lang: Lang) {
  const t = uiText[lang];
  t.__lang = lang;
  return t;
}
