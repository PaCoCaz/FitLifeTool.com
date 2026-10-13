import type { Metadata } from "next";
import {
  APP_LANGUAGES,
  asAppLanguage,
  type AppLanguage,
} from "@/lib/languagePreference";

export const PUBLIC_SITE_ORIGIN = "https://fitlifetool.com";
export const PUBLIC_DEFAULT_LOCALE: AppLanguage = "en";
export const PUBLIC_LOCALES = APP_LANGUAGES;

type LocaleDefinition = {
  label: string;
  htmlLang: string;
  openGraphLocale: string;
};

export const PUBLIC_LOCALE_REGISTRY: Record<
  AppLanguage,
  LocaleDefinition
> = {
  en: { label: "English", htmlLang: "en", openGraphLocale: "en_GB" },
  nl: { label: "Nederlands", htmlLang: "nl", openGraphLocale: "nl_NL" },
  fr: { label: "Français", htmlLang: "fr", openGraphLocale: "fr_FR" },
  de: { label: "Deutsch", htmlLang: "de", openGraphLocale: "de_DE" },
  pl: { label: "Polski", htmlLang: "pl", openGraphLocale: "pl_PL" },
};

type PublicPageDefinition = {
  indexable: boolean;
  paths: Record<AppLanguage, string>;
};

export const PUBLIC_PAGE_REGISTRY: Record<"home", PublicPageDefinition> = {
  home: {
    indexable: false,
    paths: {
      en: "/",
      nl: "/nl",
      fr: "/fr",
      de: "/de",
      pl: "/pl",
    },
  },
};

export type PublicPageKey = keyof typeof PUBLIC_PAGE_REGISTRY;

type PublicHomeBodySection = {
  eyebrow: string;
  title: string;
  description: string;
  body: readonly [string, string];
};

type PublicHomeContent = {
  eyebrow: string;
  title: string;
  description: string;
  sectionTwo: PublicHomeBodySection;
  sectionThree: PublicHomeBodySection & { visualAlt: string };
  sectionFour: PublicHomeBodySection;
  sectionFive: PublicHomeBodySection;
  sectionSix: PublicHomeBodySection;
  sectionSeven: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
  };
  primaryCta: string;
  forgotPassword: string;
  metadataTitle: string;
  metadataDescription: string;
};

type PublicHeaderMenuItem = {
  label: string;
  description: string;
};

type PublicHeaderKnowledgeGroup = {
  label: string;
  items: readonly PublicHeaderMenuItem[];
};

type PublicHeaderContent = {
  navigationLabel: string;
  login: string;
  languageLabel: string;
  headerCta: string;
  openMenu: string;
  closeMenu: string;
  goals: {
    label: string;
    items: readonly PublicHeaderMenuItem[];
  };
  knowledge: {
    label: string;
    groups: {
      weight: PublicHeaderKnowledgeGroup;
      nutrition: PublicHeaderKnowledgeGroup;
      activity: PublicHeaderKnowledgeGroup;
      hydration: PublicHeaderKnowledgeGroup;
    };
  };
};

export const PUBLIC_HOME_CONTENT: Record<AppLanguage, PublicHomeContent> = {
  en: {
    eyebrow: "Get insight into your lifestyle",
    title: "See where you stand throughout the day as you work towards your goal",
    description:
      "Bring your nutrition, activity, hydration and weight together in one personalised overview and track your progress towards your daily goals.",
    sectionTwo: {
      eyebrow: "Your lifestyle in one overview",
      title: "See how nutrition, activity, hydration and weight come together",
      description:
        "FitLifeTool brings these areas together in one personalised overview, giving you a clearer picture of your lifestyle.",
      body: [
        "Your lifestyle is about more than individual entries. What you eat, how active you are, how much you drink and how your weight changes can provide more context together than each area on its own. Looking at this information side by side makes it easier to recognise patterns across days and over longer periods.",
        "Instead of seeing only separate numbers, you get more context for your daily choices and how things change over time. You can follow what changes, what remains relatively consistent and how different areas develop alongside each other. This helps you better understand your progress and how the different parts of your lifestyle relate to one another.",
      ],
    },
    sectionThree: {
      eyebrow: "Tailored to your goal",
      visualAlt: "A scale beside FitLifeTool symbols for losing, maintaining or gaining weight.",
      title: "Daily goals that reflect what you want to achieve",
      description:
        "Whether you want to lose weight, maintain your weight or gain weight, FitLifeTool tailors your daily goals to what you want to achieve.",
      body: [
        "Your daily nutrition, activity and hydration goals are tailored to you and what you want to achieve. This means the goals you follow each day reflect your situation rather than taking a one-size-fits-all approach.",
        "What you log throughout the day can then be viewed in relation to those daily goals. This turns your personal goal into something you can follow every day.",
      ],
    },
    sectionFour: {
      eyebrow: "Insight into your day",
      title: "See how you're progressing throughout the day",
      description:
        "FitLifeTool compares your actual progress with the progress expected towards your daily goals at that point in the day.",
      body: [
        "You do not need to have completed the same proportion of each daily goal at every point in the day. That is why FitLifeTool considers not only what you have logged, but also the time of day. For nutrition, activity and hydration, your actual progress is compared with a daily schedule that is automatically tailored to you and your goal.",
        "That schedule is a reference, not a requirement. You can intentionally be ahead or behind when that suits your day better. New entries are reflected in your actual progress straight away, so you can keep seeing where you stand compared with your expected progress.",
      ],
    },
    sectionFive: {
      eyebrow: "Progress and trends",
      title: "See how your progress develops over time",
      description:
        "Looking beyond a single day gives you a clearer picture of changes in your lifestyle and weight.",
      body: [
        "Track your weight over time and look back at your nutrition, activity and hydration across different periods. This lets you see changes that may not be visible within a single day.",
        "One day does not have to define your progress. By looking back over a longer period, you can see patterns in your progress more clearly and put individual days into better context.",
      ],
    },
    sectionSix: {
      eyebrow: "Trust and control",
      title: "You stay in control of your choices",
      description:
        "FitLifeTool gives you insight into your lifestyle and progress while you decide which choices suit your situation and goal.",
      body: [
        "No two days are exactly the same. FitLifeTool helps you see where you stand and what is changing without deciding what you should do. The insights provide context; the choices remain yours.",
        "We also handle your personal data with care. We use no more data than necessary to provide FitLifeTool and your personalised experience.",
      ],
    },
    sectionSeven: {
      eyebrow: "Ready to get started?",
      title: "Get insight into your lifestyle and progress",
      description:
        "Create a free account and discover how FitLifeTool helps you track your daily progress towards your goal.",
      primaryCta: "Create a free account",
    },
    primaryCta: "Create a free account",
    forgotPassword: "Forgot password?",
    metadataTitle: "FitLifeTool | Lifestyle & Progress Insights",
    metadataDescription:
      "Get insight into your nutrition, activity, hydration and weight. Track your daily progress and see how it aligns with your personal goal.",
  },
  nl: {
    eyebrow: "Krijg inzicht in je leefstijl",
    title: "Zie gedurende de dag waar je staat op weg naar jouw doel",
    description:
      "Breng je voeding, beweging, hydratatie en gewicht samen in één persoonlijk overzicht en volg je voortgang richting jouw dagelijkse doelen.",
    sectionTwo: {
      eyebrow: "Jouw leefstijl in één overzicht",
      title: "Zie hoe voeding, beweging, hydratatie en gewicht samenkomen",
      description:
        "FitLifeTool brengt deze onderdelen samen in één persoonlijk overzicht, zodat je meer inzicht krijgt in jouw leefstijl.",
      body: [
        "Je leefstijl bestaat uit meer dan losse registraties. Wat je eet, hoeveel je beweegt, hoeveel je drinkt en hoe je gewicht zich ontwikkelt, kunnen samen meer context geven dan ieder onderdeel afzonderlijk. Door die informatie naast elkaar te bekijken, wordt het makkelijker om patronen over dagen en langere periodes te herkennen.",
        "Zo zie je niet alleen afzonderlijke cijfers, maar krijg je meer context bij je dagelijkse keuzes en de ontwikkeling die je doormaakt. Je kunt beter volgen wat er verandert, wat redelijk constant blijft en hoe verschillende onderdelen zich naast elkaar ontwikkelen. Dat helpt je om je voortgang beter te begrijpen en bewuster naar je leefstijl te kijken.",
      ],
    },
    sectionThree: {
      eyebrow: "Afgestemd op jouw doel",
      visualAlt: "Een weegschaal naast FitLifeTool-symbolen voor afvallen, op gewicht blijven of aankomen.",
      title: "Dagelijkse doelen die passen bij wat jij wilt bereiken",
      description:
        "Of je nu wilt afvallen, op gewicht wilt blijven of wilt aankomen: FitLifeTool stemt je dagelijkse doelen af op wat jij wilt bereiken.",
      body: [
        "Je doel en persoonlijke uitgangspunten vormen de basis voor je dagelijkse doelen voor voeding, beweging en hydratatie. Zo sluiten de doelen die je iedere dag volgt aan op jouw situatie, in plaats van uit te gaan van dezelfde uitgangspunten voor iedereen.",
        "Wat je gedurende de dag registreert, kun je vervolgens bekijken in relatie tot die dagelijkse doelen. Zo wordt je persoonlijke doel vertaald naar iets wat je iedere dag kunt volgen.",
      ],
    },
    sectionFour: {
      eyebrow: "Inzicht in je dagverloop",
      title: "Zie hoe je dagelijkse voortgang zich ontwikkelt",
      description:
        "FitLifeTool vergelijkt je actuele voortgang met de voortgang die op dat moment bij je dagelijkse doelen wordt verwacht.",
      body: [
        "Je hoeft je dagelijkse doelen niet op ieder moment van de dag even ver te hebben bereikt. Daarom kijkt FitLifeTool niet alleen naar wat je hebt geregistreerd, maar ook naar het moment van de dag. Voor voeding, beweging en hydratatie wordt je actuele voortgang vergeleken met een dagschema dat automatisch wordt afgestemd op jouw doel en persoonlijke uitgangspunten.",
        "Dat dagschema is een referentie, geen verplichting. Je kunt bewust voor- of achterlopen wanneer dat beter bij je dag past. Nieuwe registraties worden direct in je actuele voortgang verwerkt, zodat je steeds kunt zien waar je staat ten opzichte van je verwachte voortgang.",
      ],
    },
    sectionFive: {
      eyebrow: "Voortgang en trends",
      title: "Zie hoe je voortgang zich over tijd ontwikkelt",
      description:
        "Door verder terug te kijken dan één dag, krijg je een beter beeld van veranderingen in je leefstijl en gewicht.",
      body: [
        "Volg je gewichtsverloop en kijk terug op je voeding, beweging en hydratatie over verschillende periodes. Zo zie je veranderingen die binnen één afzonderlijke dag niet zichtbaar zijn.",
        "Een enkele dag hoeft niet bepalend te zijn voor je voortgang. Door over een langere periode terug te kijken, zie je duidelijker patronen in je voortgang en krijg je meer context bij afzonderlijke dagen.",
      ],
    },
    sectionSix: {
      eyebrow: "Vertrouwen en regie",
      title: "Jij houdt de regie over jouw keuzes",
      description:
        "FitLifeTool geeft je inzicht in je leefstijl en voortgang, terwijl jij bepaalt welke keuzes passen bij jouw situatie en doel.",
      body: [
        "Geen dag verloopt precies hetzelfde. FitLifeTool helpt je te zien waar je staat en wat er verandert, zonder voor jou te bepalen wat je moet doen. De inzichten geven je context; de keuzes blijven van jou.",
        "Ook met je persoonlijke gegevens gaan we zorgvuldig om. We gebruiken niet meer gegevens dan nodig is om FitLifeTool en jouw persoonlijke ervaring mogelijk te maken.",
      ],
    },
    sectionSeven: {
      eyebrow: "Klaar om te beginnen?",
      title: "Krijg inzicht in jouw leefstijl en voortgang",
      description:
        "Maak gratis een account aan en ontdek hoe FitLifeTool je helpt om je dagelijkse voortgang richting jouw doel te volgen.",
      primaryCta: "Gratis account aanmaken",
    },
    primaryCta: "Gratis account aanmaken",
    forgotPassword: "Wachtwoord vergeten?",
    metadataTitle: "FitLifeTool | Inzicht in je leefstijl en voortgang",
    metadataDescription:
      "Krijg inzicht in je voeding, beweging, hydratatie en gewicht. Volg je dagelijkse voortgang en zie hoe die aansluit op jouw persoonlijke doel.",
  },
  fr: {
    eyebrow: "Mieux comprendre ton mode de vie",
    title: "Vois où tu en es au fil de la journée sur le chemin vers ton objectif",
    description:
      "Réunis ton alimentation, ton activité physique, ton hydratation et ton poids dans une vue d’ensemble personnalisée, et suis tes progrès vers tes objectifs quotidiens.",
    sectionTwo: {
      eyebrow: "Ton mode de vie en un coup d’œil",
      title: "Vois comment ton alimentation, ton activité physique, ton hydratation et ton poids sont liés",
      description:
        "FitLifeTool réunit ces différents aspects dans une vue d’ensemble personnalisée pour t’aider à mieux comprendre ton mode de vie.",
      body: [
        "Ton mode de vie ne se résume pas à des données prises séparément. Ce que tu manges, ton niveau d’activité, ce que tu bois et l’évolution de ton poids peuvent apporter davantage de contexte lorsqu’ils sont considérés ensemble. En regardant ces informations côte à côte, il devient plus facile d’identifier des tendances au fil des jours et sur des périodes plus longues.",
        "Tu ne vois ainsi pas seulement des chiffres isolés : tu peux aussi mieux comprendre tes choix quotidiens et la façon dont les différents aspects de ton mode de vie évoluent. Tu peux voir plus clairement ce qui change, ce qui reste relativement stable et comment les différents aspects de ton mode de vie se situent les uns par rapport aux autres. Cela t’aide à mieux comprendre tes progrès et les liens entre les différentes dimensions de ton mode de vie.",
      ],
    },
    sectionThree: {
      eyebrow: "Adapté à ton objectif",
      visualAlt: "Une balance à côté de symboles FitLifeTool pour perdre, maintenir ou prendre du poids.",
      title: "Des objectifs quotidiens adaptés à ce que tu veux atteindre",
      description:
        "Que tu souhaites perdre du poids, maintenir ton poids ou en prendre, FitLifeTool adapte tes objectifs quotidiens à ce que tu veux atteindre.",
      body: [
        "Tes objectifs quotidiens en matière d’alimentation, d’activité physique et d’hydratation sont adaptés à ta situation et à ton objectif. Les objectifs que tu suis chaque jour tiennent ainsi compte de ta situation personnelle, plutôt que de reposer sur les mêmes critères pour tout le monde.",
        "Ce que tu enregistres au fil de la journée peut ensuite être mis en perspective avec ces objectifs quotidiens. Ton objectif personnel devient ainsi quelque chose de concret que tu peux suivre jour après jour.",
      ],
    },
    sectionFour: {
      eyebrow: "Savoir où tu en es dans ta journée",
      title: "Vois comment tu progresses au fil de la journée",
      description:
        "FitLifeTool te montre où tu en es à ce moment de la journée par rapport à la progression prévue pour tes objectifs quotidiens.",
      body: [
        "Tu n’as pas besoin d’avoir atteint la même proportion de chacun de tes objectifs quotidiens à chaque moment de la journée. FitLifeTool tient donc compte non seulement de ce que tu as enregistré, mais aussi du moment de la journée. Pour l’alimentation, l’activité physique et l’hydratation, tes progrès sont comparés à un repère au fil de la journée, automatiquement adapté à toi et à ton objectif.",
        "Ce repère est là pour t’aider à te situer, pas pour t’imposer un rythme. Tu peux volontairement être en avance ou en retrait si cela correspond mieux à ta journée. Chaque nouvel enregistrement est immédiatement pris en compte, afin que tu puisses toujours voir où tu en es par rapport à la progression prévue.",
      ],
    },
    sectionFive: {
      eyebrow: "Progrès et tendances",
      title: "Vois comment tes progrès évoluent au fil du temps",
      description:
        "Regarder au-delà d’une seule journée te permet de mieux comprendre l’évolution de ton mode de vie et de ton poids.",
      body: [
        "Suis l’évolution de ton poids et reviens sur ton alimentation, ton activité physique et ton hydratation sur différentes périodes. Tu peux ainsi repérer des changements qui ne sont pas forcément visibles au cours d’une seule journée.",
        "Une seule journée ne définit pas tes progrès. En prenant davantage de recul, tu peux mieux identifier les tendances dans tes progrès et replacer chaque journée dans un contexte plus large.",
      ],
    },
    sectionSix: {
      eyebrow: "Confiance et liberté de choix",
      title: "C’est toi qui décides de ce qui te convient",
      description:
        "FitLifeTool t’aide à mieux comprendre ton mode de vie et tes progrès, tandis que tu décides toi-même de ce qui correspond à ta situation et à ton objectif.",
      body: [
        "Aucune journée ne se déroule exactement de la même façon. FitLifeTool t’aide à voir où tu en es et ce qui évolue, sans décider à ta place de ce que tu dois faire. Les informations t’apportent du contexte ; les choix restent les tiens.",
        "Nous traitons également tes données personnelles avec soin. Nous n’utilisons pas plus de données que nécessaire pour faire fonctionner FitLifeTool et personnaliser ton expérience.",
      ],
    },
    sectionSeven: {
      eyebrow: "Prêt à commencer ?",
      title: "Mieux comprendre ton mode de vie et tes progrès",
      description:
        "Crée un compte gratuitement et découvre comment FitLifeTool t’aide à suivre tes progrès quotidiens vers ton objectif.",
      primaryCta: "Créer un compte gratuitement",
    },
    primaryCta: "Créer un compte gratuitement",
    forgotPassword: "Mot de passe oublié ?",
    metadataTitle: "FitLifeTool | Mieux comprendre ton mode de vie et tes progrès",
    metadataDescription:
      "Mieux comprendre ton alimentation, ton activité physique, ton hydratation et ton poids. Suis tes progrès quotidiens en fonction de ton objectif personnel.",
  },
  de: {
    eyebrow: "Gewinne Einblick in deinen Lebensstil",
    title: "Sieh im Laufe des Tages, wo du auf dem Weg zu deinem Ziel stehst",
    description:
      "Sieh Ernährung, Bewegung, Trinken und Gewicht auf einen Blick und verfolge deinen Fortschritt bei deinen täglichen Zielen.",
    sectionTwo: {
      eyebrow: "Dein Lebensstil auf einen Blick",
      title: "Sieh, wie Ernährung, Bewegung, Flüssigkeitszufuhr und Gewicht zusammenwirken",
      description:
        "FitLifeTool bringt diese Bereiche in einer persönlichen Übersicht zusammen, damit du deinen Lebensstil besser verstehen kannst.",
      body: [
        "Dein Lebensstil besteht aus mehr als einzelnen Einträgen. Was du isst, wie viel du dich bewegst, wie viel du trinkst und wie sich dein Gewicht entwickelt, kann zusammen mehr Kontext geben als jeder Bereich für sich. Wenn du diese Informationen nebeneinander betrachtest, kannst du Muster über mehrere Tage und längere Zeiträume leichter erkennen.",
        "So siehst du nicht nur einzelne Zahlen, sondern erhältst mehr Kontext zu deinen täglichen Entscheidungen und dazu, wie sich verschiedene Bereiche entwickeln. Du kannst besser verfolgen, was sich verändert, was relativ konstant bleibt und wie sich die einzelnen Bereiche im Verhältnis zueinander entwickeln. Das hilft dir, deinen Fortschritt besser zu verstehen und die Zusammenhänge in deinem Lebensstil klarer zu erkennen.",
      ],
    },
    sectionThree: {
      eyebrow: "Auf dein Ziel abgestimmt",
      visualAlt: "Eine Waage neben FitLifeTool-Symbolen für Abnehmen, Gewicht halten oder Zunehmen.",
      title: "Tägliche Ziele, die zu dem passen, was du erreichen möchtest",
      description:
        "Ob du abnehmen, dein Gewicht halten oder zunehmen möchtest: FitLifeTool stimmt deine täglichen Ziele darauf ab, was du erreichen möchtest.",
      body: [
        "Deine täglichen Ziele für Ernährung, Bewegung und Flüssigkeitszufuhr werden auf dich und dein persönliches Ziel abgestimmt. So orientieren sich die Ziele, die du jeden Tag verfolgst, an deiner persönlichen Situation, statt für alle von denselben Voraussetzungen auszugehen.",
        "Was du im Laufe des Tages einträgst, kannst du anschließend im Verhältnis zu diesen täglichen Zielen betrachten. So wird aus deinem persönlichen Ziel etwas, das du jeden Tag konkret verfolgen kannst.",
      ],
    },
    sectionFour: {
      eyebrow: "Einblick in deinen Tagesverlauf",
      title: "Sieh, wie du im Laufe des Tages vorankommst",
      description:
        "FitLifeTool vergleicht deinen aktuellen Fortschritt mit dem Stand, der zu diesem Zeitpunkt für deine täglichen Ziele vorgesehen ist.",
      body: [
        "Du musst deine täglichen Ziele nicht zu jedem Zeitpunkt des Tages im gleichen Maß erreicht haben. Deshalb berücksichtigt FitLifeTool nicht nur, was du eingetragen hast, sondern auch die Tageszeit. Bei Ernährung, Bewegung und Flüssigkeitszufuhr wird dein aktueller Fortschritt mit einem individuellen Tagesverlauf verglichen, der automatisch auf dein Ziel und deine persönlichen Voraussetzungen abgestimmt wird.",
        "Dieser Tagesverlauf dient als Orientierung, nicht als Vorgabe. Du kannst bewusst weiter oder weniger weit sein, wenn das besser zu deinem Tag passt. Neue Einträge werden direkt in deinem aktuellen Fortschritt berücksichtigt. So kannst du jederzeit sehen, wo du im Vergleich zu deinem vorgesehenen Fortschritt stehst.",
      ],
    },
    sectionFive: {
      eyebrow: "Fortschritt und Trends",
      title: "Sieh, wie sich dein Fortschritt im Laufe der Zeit entwickelt",
      description:
        "Wenn du über einen einzelnen Tag hinaus zurückblickst, erhältst du ein klareres Bild davon, wie sich dein Lebensstil und dein Gewicht verändern.",
      body: [
        "Verfolge deine Gewichtsentwicklung und blicke über verschiedene Zeiträume auf deine Ernährung, Bewegung und Flüssigkeitszufuhr zurück. So erkennst du Veränderungen, die innerhalb eines einzelnen Tages möglicherweise nicht sichtbar sind.",
        "Ein einzelner Tag muss nicht entscheidend für deinen Fortschritt sein. Wenn du über einen längeren Zeitraum zurückblickst, kannst du Muster in deinem Fortschritt deutlicher erkennen und einzelne Tage besser einordnen.",
      ],
    },
    sectionSix: {
      eyebrow: "Vertrauen und Selbstbestimmung",
      title: "Du entscheidest, was zu dir passt",
      description:
        "FitLifeTool gibt dir Einblick in deinen Lebensstil und deinen Fortschritt, während du selbst entscheidest, was zu deiner Situation und deinem Ziel passt.",
      body: [
        "Kein Tag verläuft genau wie der andere. FitLifeTool hilft dir zu sehen, wo du stehst und was sich verändert, ohne dir vorzuschreiben, was du tun sollst. Die Einblicke geben dir Orientierung – die Entscheidungen bleiben bei dir.",
        "Auch mit deinen persönlichen Daten gehen wir sorgfältig um. Wir verwenden nicht mehr Daten, als erforderlich sind, um FitLifeTool und dein persönliches Nutzungserlebnis zu ermöglichen.",
      ],
    },
    sectionSeven: {
      eyebrow: "Bereit, loszulegen?",
      title: "Gewinne Einblick in deinen Lebensstil und deinen Fortschritt",
      description:
        "Erstelle ein kostenloses Konto und entdecke, wie FitLifeTool dir hilft, deinen täglichen Fortschritt auf dem Weg zu deinem Ziel zu verfolgen.",
      primaryCta: "Kostenloses Konto erstellen",
    },
    primaryCta: "Kostenloses Konto erstellen",
    forgotPassword: "Passwort vergessen?",
    metadataTitle: "FitLifeTool | Einblick in Lebensstil und Fortschritt",
    metadataDescription:
      "Gewinne Einblick in Ernährung, Bewegung, Flüssigkeitszufuhr und Gewicht. Verfolge deinen täglichen Fortschritt und sieh, wie er zu deinem persönlichen Ziel passt.",
  },
  pl: {
    eyebrow: "Lepiej zrozum swój styl życia",
    title: "Zobacz w ciągu dnia, gdzie jesteś na drodze do swojego celu",
    description:
      "Połącz informacje o odżywianiu, aktywności fizycznej, nawodnieniu i wadze w jednym spersonalizowanym zestawieniu i śledź postępy w realizacji swoich dziennych celów.",
    sectionTwo: {
      eyebrow: "Twój styl życia w jednym miejscu",
      title: "Zobacz, jak łączą się odżywianie, aktywność fizyczna, nawodnienie i waga",
      description:
        "FitLifeTool łączy te obszary w jednym spersonalizowanym zestawieniu, pomagając Ci lepiej zrozumieć swój styl życia.",
      body: [
        "Twój styl życia to coś więcej niż pojedyncze wpisy. To, co jesz, jak dużo się ruszasz, ile pijesz i jak zmienia się Twoja waga, daje więcej kontekstu, gdy spojrzysz na te informacje razem, a nie na każdy obszar osobno. Zestawienie ich obok siebie ułatwia dostrzeganie powtarzających się tendencji na przestrzeni kolejnych dni i dłuższych okresów.",
        "Dzięki temu widzisz nie tylko pojedyncze liczby, ale zyskujesz też więcej kontekstu dla swoich codziennych wyborów i zachodzących zmian. Możesz lepiej zauważyć, co się zmienia, co pozostaje względnie stałe i jak poszczególne obszary wyglądają względem siebie w czasie. Pomaga Ci to lepiej rozumieć swoje postępy i zależności między różnymi elementami Twojego stylu życia.",
      ],
    },
    sectionThree: {
      eyebrow: "Dopasowane do Twojego celu",
      visualAlt: "Waga obok symboli FitLifeTool oznaczających odchudzanie, utrzymanie wagi lub przybranie na wadze.",
      title: "Dzienne cele dopasowane do tego, co chcesz osiągnąć",
      description:
        "Niezależnie od tego, czy chcesz schudnąć, utrzymać wagę czy przytyć, FitLifeTool dopasowuje Twoje dzienne cele do tego, co chcesz osiągnąć.",
      body: [
        "Twoje dzienne cele dotyczące odżywiania, aktywności fizycznej i nawodnienia są dopasowane do Ciebie i Twojego celu. Dzięki temu cele, które śledzisz każdego dnia, uwzględniają Twoją indywidualną sytuację, zamiast opierać się na takich samych założeniach dla wszystkich.",
        "To, co rejestrujesz w ciągu dnia, możesz następnie zobaczyć w odniesieniu do swoich dziennych celów. W ten sposób Twój osobisty cel staje się czymś konkretnym, co możesz śledzić każdego dnia.",
      ],
    },
    sectionFour: {
      eyebrow: "Zobacz, gdzie jesteś w ciągu dnia",
      title: "Śledź swoje postępy w ciągu dnia",
      description:
        "FitLifeTool pokazuje, gdzie jesteś w danym momencie dnia w porównaniu z postępem przewidzianym dla Twoich dziennych celów.",
      body: [
        "Nie musisz być na takim samym etapie realizacji każdego dziennego celu o każdej porze dnia. Dlatego FitLifeTool bierze pod uwagę nie tylko to, co rejestrujesz, ale również porę dnia. W przypadku odżywiania, aktywności fizycznej i nawodnienia Twoje aktualne postępy są porównywane z indywidualnym poziomem odniesienia w ciągu dnia, automatycznie dopasowanym do Ciebie i Twojego celu.",
        "Ten poziom odniesienia służy jako wskazówka, a nie jako sztywny plan, którego musisz się trzymać. Możesz świadomie być powyżej lub poniżej tego poziomu, jeśli lepiej pasuje to do przebiegu Twojego dnia. Każdy nowy wpis jest od razu uwzględniany w Twoich aktualnych postępach, dzięki czemu możesz na bieżąco sprawdzać, gdzie jesteś w porównaniu z przewidzianym postępem.",
      ],
    },
    sectionFive: {
      eyebrow: "Postępy i trendy",
      title: "Zobacz, jak zmieniają się Twoje postępy w czasie",
      description:
        "Spojrzenie na okres dłuższy niż jeden dzień pozwala lepiej zobaczyć zmiany w Twoim stylu życia i wadze.",
      body: [
        "Śledź zmiany swojej wagi i wracaj do informacji o odżywianiu, aktywności fizycznej i nawodnieniu z różnych okresów. Dzięki temu możesz zauważyć zmiany, które nie są widoczne w ciągu jednego dnia.",
        "Jeden dzień nie musi decydować o Twoich postępach. Patrząc na dłuższy okres, możesz wyraźniej dostrzec tendencje w swoich postępach i spojrzeć na poszczególne dni w szerszym kontekście.",
      ],
    },
    sectionSix: {
      eyebrow: "Zaufanie i swoboda wyboru",
      title: "To Ty decydujesz, co do Ciebie pasuje",
      description:
        "FitLifeTool pomaga Ci lepiej zrozumieć swój styl życia i postępy, a Ty decydujesz, jakie wybory pasują do Twojej sytuacji i celu.",
      body: [
        "Każdy dzień może wyglądać inaczej. FitLifeTool pomaga Ci zobaczyć, gdzie jesteś i co się zmienia, bez narzucania Ci, co masz robić. Otrzymujesz kontekst, który pomaga Ci lepiej się zorientować, ale decyzje pozostają po Twojej stronie.",
        "Dbamy również o Twoje dane osobowe. Korzystamy tylko z danych potrzebnych do działania FitLifeTool i zapewnienia Ci spersonalizowanego doświadczenia.",
      ],
    },
    sectionSeven: {
      eyebrow: "Gotowy, aby zacząć?",
      title: "Lepiej zrozum swój styl życia i postępy",
      description:
        "Załóż bezpłatne konto i zobacz, jak FitLifeTool pomaga Ci śledzić codzienne postępy na drodze do Twojego celu.",
      primaryCta: "Załóż bezpłatne konto",
    },
    primaryCta: "Załóż bezpłatne konto",
    forgotPassword: "Nie pamiętasz hasła?",
    metadataTitle: "FitLifeTool | Lepiej zrozum swój styl życia i postępy",
    metadataDescription:
      "Lepiej zrozum swoje odżywianie, aktywność fizyczną, nawodnienie i wagę. Śledź codzienne postępy i zobacz, jak odnoszą się do Twojego celu.",
  },
};

export const PUBLIC_HEADER_CONTENT: Record<AppLanguage, PublicHeaderContent> = {
  en: {
    navigationLabel: "Main navigation",
    login: "Log in",
    languageLabel: "Choose language",
    headerCta: "Start free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    goals: {
      label: "Goals",
      items: [
        { label: "Lose weight", description: "Lose weight in a healthy way" },
        { label: "Maintain weight", description: "Stay balanced and feel good" },
        { label: "Gain weight", description: "Gain weight healthily and get stronger" },
      ],
    },
    knowledge: {
      label: "Knowledge & tools",
      groups: {
        weight: {
          label: "Weight & body",
          items: [
            { label: "Calculate BMI", description: "Calculate your BMI and BMI category" },
            { label: "Energy needs", description: "Discover your daily needs" },
          ],
        },
        nutrition: {
          label: "Nutrition",
          items: [
            { label: "Nutrition", description: "Everything about healthy eating" },
            { label: "Protein", description: "Why protein matters" },
            { label: "Foods", description: "Information about foods" },
          ],
        },
        activity: {
          label: "Activity",
          items: [
            { label: "Activity guidelines", description: "How much activity do you need?" },
            { label: "Energy expenditure", description: "Calculate expenditure by activity" },
          ],
        },
        hydration: {
          label: "Hydration",
          items: [
            { label: "Hydration", description: "Are you drinking enough water?" },
          ],
        },
      },
    },
  },
  nl: {
    navigationLabel: "Hoofdnavigatie",
    login: "Inloggen",
    languageLabel: "Kies taal",
    headerCta: "Gratis starten",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    goals: {
      label: "Doelen",
      items: [
        { label: "Afvallen", description: "Verlies gewicht op een gezonde manier" },
        { label: "Gewicht onderhouden", description: "Blijf in balans en voel je goed" },
        { label: "Aankomen", description: "Kom gezond aan en word sterker" },
      ],
    },
    knowledge: {
      label: "Kennis & tools",
      groups: {
        weight: {
          label: "Gewicht & lichaam",
          items: [
            { label: "BMI berekenen", description: "Bereken je BMI en BMI-categorie" },
            { label: "Energiebehoefte", description: "Ontdek je dagelijkse behoefte" },
          ],
        },
        nutrition: {
          label: "Voeding",
          items: [
            { label: "Voeding", description: "Alles over gezonde voeding" },
            { label: "Eiwit", description: "Waarom eiwit belangrijk is" },
            { label: "Voedingsmiddelen", description: "Informatie over voedingsmiddelen" },
          ],
        },
        activity: {
          label: "Beweging",
          items: [
            { label: "Beweegrichtlijnen", description: "Hoeveel beweging heb je nodig?" },
            { label: "Energieverbruik", description: "Verbruik berekenen per activiteit" },
          ],
        },
        hydration: {
          label: "Hydratatie",
          items: [
            { label: "Hydratatie", description: "Drink je genoeg water?" },
          ],
        },
      },
    },
  },
  fr: {
    navigationLabel: "Navigation principale",
    login: "Se connecter",
    languageLabel: "Choisir la langue",
    headerCta: "Commencer gratuitement",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    goals: {
      label: "Objectifs",
      items: [
        { label: "Perdre du poids", description: "Perdez du poids sainement" },
        { label: "Maintenir son poids", description: "Gardez votre équilibre et votre bien-être" },
        { label: "Prendre du poids", description: "Prenez du poids sainement et gagnez en force" },
      ],
    },
    knowledge: {
      label: "Connaissances & outils",
      groups: {
        weight: {
          label: "Poids & corps",
          items: [
            { label: "Calculer l’IMC", description: "Calculez votre IMC et sa catégorie" },
            { label: "Besoins énergétiques", description: "Découvrez vos besoins quotidiens" },
          ],
        },
        nutrition: {
          label: "Nutrition",
          items: [
            { label: "Nutrition", description: "Tout savoir sur une alimentation saine" },
            { label: "Protéines", description: "Pourquoi les protéines sont importantes" },
            { label: "Aliments", description: "Informations sur les aliments" },
          ],
        },
        activity: {
          label: "Activité",
          items: [
            { label: "Recommandations d’activité", description: "De combien d’activité avez-vous besoin ?" },
            { label: "Dépense énergétique", description: "Calculez la dépense par activité" },
          ],
        },
        hydration: {
          label: "Hydratation",
          items: [
            { label: "Hydratation", description: "Buvez-vous assez d’eau ?" },
          ],
        },
      },
    },
  },
  de: {
    navigationLabel: "Hauptnavigation",
    login: "Anmelden",
    languageLabel: "Sprache wählen",
    headerCta: "Kostenlos starten",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    goals: {
      label: "Ziele",
      items: [
        { label: "Abnehmen", description: "Gesund Gewicht verlieren" },
        { label: "Gewicht halten", description: "Im Gleichgewicht bleiben und sich wohlfühlen" },
        { label: "Zunehmen", description: "Gesund zunehmen und stärker werden" },
      ],
    },
    knowledge: {
      label: "Wissen & Tools",
      groups: {
        weight: {
          label: "Gewicht & Körper",
          items: [
            { label: "BMI berechnen", description: "BMI und BMI-Kategorie berechnen" },
            { label: "Energiebedarf", description: "Täglichen Bedarf entdecken" },
          ],
        },
        nutrition: {
          label: "Ernährung",
          items: [
            { label: "Ernährung", description: "Alles über gesunde Ernährung" },
            { label: "Protein", description: "Warum Protein wichtig ist" },
            { label: "Lebensmittel", description: "Informationen über Lebensmittel" },
          ],
        },
        activity: {
          label: "Bewegung",
          items: [
            { label: "Bewegungsempfehlungen", description: "Wie viel Bewegung brauchst du?" },
            { label: "Energieverbrauch", description: "Verbrauch je Aktivität berechnen" },
          ],
        },
        hydration: {
          label: "Flüssigkeitszufuhr",
          items: [
            { label: "Flüssigkeitszufuhr", description: "Trinkst du genug Wasser?" },
          ],
        },
      },
    },
  },
  pl: {
    navigationLabel: "Nawigacja główna",
    login: "Zaloguj się",
    languageLabel: "Wybierz język",
    headerCta: "Zacznij bezpłatnie",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    goals: {
      label: "Cele",
      items: [
        { label: "Schudnąć", description: "Zdrowo zmniejsz masę ciała" },
        { label: "Utrzymać wagę", description: "Zachowaj równowagę i dobre samopoczucie" },
        { label: "Przytyć", description: "Zdrowo zwiększ masę ciała i siłę" },
      ],
    },
    knowledge: {
      label: "Wiedza i narzędzia",
      groups: {
        weight: {
          label: "Waga i ciało",
          items: [
            { label: "Oblicz BMI", description: "Oblicz BMI i jego kategorię" },
            { label: "Zapotrzebowanie energetyczne", description: "Poznaj swoje dzienne zapotrzebowanie" },
          ],
        },
        nutrition: {
          label: "Odżywianie",
          items: [
            { label: "Odżywianie", description: "Wszystko o zdrowym odżywianiu" },
            { label: "Białko", description: "Dlaczego białko jest ważne" },
            { label: "Produkty spożywcze", description: "Informacje o produktach spożywczych" },
          ],
        },
        activity: {
          label: "Aktywność",
          items: [
            { label: "Zalecenia dotyczące ruchu", description: "Ile ruchu potrzebujesz?" },
            { label: "Wydatek energetyczny", description: "Oblicz wydatek dla aktywności" },
          ],
        },
        hydration: {
          label: "Nawodnienie",
          items: [
            { label: "Nawodnienie", description: "Czy pijesz wystarczająco dużo wody?" },
          ],
        },
      },
    },
  },
};

type PublicFooterContent = {
  slogan: string;
  navigationLabel: string;
  labels: readonly [string, string, string, string];
  faq: string;
  sitemap: string;
};

export const PUBLIC_FOOTER_CONTENT: Record<AppLanguage, PublicFooterContent> = {
  nl: {
    slogan: "Neem de regie en krijg inzicht in je leefstijl!",
    navigationLabel: "Footernavigatie",
    labels: ["Privacy", "Voorwaarden", "Over ons", "Contact"],
    faq: "FAQ",
    sitemap: "Sitemap",
  },
  en: {
    slogan: "Take control and understand your lifestyle!",
    navigationLabel: "Footer navigation",
    labels: ["Privacy", "Terms", "About us", "Contact"],
    faq: "FAQ",
    sitemap: "Sitemap",
  },
  de: {
    slogan: "Entscheide selbst und verstehe deinen Lebensstil!",
    navigationLabel: "Footernavigation",
    labels: ["Datenschutz", "Nutzungsbedingungen", "Über uns", "Kontakt"],
    faq: "FAQ",
    sitemap: "Sitemap",
  },
  fr: {
    slogan: "Prends les choses en main et comprends ton mode de vie !",
    navigationLabel: "Navigation de pied de page",
    labels: ["Confidentialité", "Conditions d’utilisation", "À propos de nous", "Contact"],
    faq: "FAQ",
    sitemap: "Sitemap",
  },
  pl: {
    slogan: "Przejmij kontrolę i poznaj swój styl życia!",
    navigationLabel: "Nawigacja w stopce",
    labels: ["Prywatność", "Warunki korzystania", "O nas", "Kontakt"],
    faq: "FAQ",
    sitemap: "Mapa strony",
  },
};

export function asPublicLocale(value: unknown): AppLanguage | null {
  return asAppLanguage(value);
}

export function getPublicPagePath(
  pageKey: PublicPageKey,
  locale: AppLanguage
) {
  return PUBLIC_PAGE_REGISTRY[pageKey].paths[locale];
}

export function getPublicHomePath(locale: unknown) {
  const safeLocale = asPublicLocale(locale) ?? PUBLIC_DEFAULT_LOCALE;
  return getPublicPagePath("home", safeLocale);
}

export function findPublicLocaleForPathname(pathname: string) {
  for (const locale of PUBLIC_LOCALES) {
    if (getPublicPagePath("home", locale) === pathname) return locale;
  }

  return null;
}

export function getPublicLocaleForPathname(pathname: string) {
  return findPublicLocaleForPathname(pathname) ?? PUBLIC_DEFAULT_LOCALE;
}

export function getPublicAlternates(pageKey: PublicPageKey) {
  const languages = Object.fromEntries(
    PUBLIC_LOCALES.map((locale) => [
      locale,
      new URL(getPublicPagePath(pageKey, locale), PUBLIC_SITE_ORIGIN).href,
    ])
  );

  return {
    canonical: languages[PUBLIC_DEFAULT_LOCALE],
    languages: {
      ...languages,
      "x-default": languages[PUBLIC_DEFAULT_LOCALE],
    },
  };
}

export function getLocalizedPublicAlternates(
  pageKey: PublicPageKey,
  locale: AppLanguage
) {
  const alternates = getPublicAlternates(pageKey);
  return {
    canonical: new URL(
      getPublicPagePath(pageKey, locale),
      PUBLIC_SITE_ORIGIN
    ).href,
    languages: alternates.languages,
  };
}

export function getPublicAuthHref(
  entrypoint: "login" | "register" | "forgot-password",
  locale: AppLanguage
) {
  return `/${entrypoint}?lang=${locale}`;
}

export function getPublicHomeMetadata(locale: AppLanguage): Metadata {
  const content = PUBLIC_HOME_CONTENT[locale];
  const alternates = getLocalizedPublicAlternates("home", locale);

  return {
    title: content.metadataTitle,
    description: content.metadataDescription,
    alternates,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName: "FitLifeTool",
      locale: PUBLIC_LOCALE_REGISTRY[locale].openGraphLocale,
      title: content.metadataTitle,
      description: content.metadataDescription,
    },
  };
}
