// app/handbook/handbookRegistry.ts

export type HoofdstukMeta = {
  hoofdstuk: string;
  titel: string;
  intro: string;
  path: string;
};

export const hoofdstukken: HoofdstukMeta[] = [
  {
    hoofdstuk: "H1",
    titel: "Kernarchitectuur",
    intro:
      "Dit hoofdstuk beschrijft de fundamentele ontwerpkeuzes en architecturale principes waarop FitLifeTool is gebouwd.",
    path: "/handbook/hoofdstuk-h1",
  },
  {
    hoofdstuk: "H2",
    titel: "Datamodel & Persistentie",
    intro:
      "Uitleg over entiteiten, relaties, opslagstrategie en de dag-centrische datalaag.",
    path: "/handbook/hoofdstuk-h2",
  },
  {
    hoofdstuk: "H3",
    titel: "Doelen, Scores & Voortgang",
    intro:
      "Hoe FitLifeTool voortgang meet, interpreteert en vertaalt naar scores, kleuren en status.",
    path: "/handbook/hoofdstuk-h3",
  },
  {
    hoofdstuk: "H4",
    titel: "UI-systeem & Kaarten",
    intro:
      "Visuele architectuur, kaartstructuur en interactiepatronen binnen de applicatie.",
    path: "/handbook/hoofdstuk-h4",
  },
  {
    hoofdstuk: "H5",
    titel: "Uitbreidbaarheid & Roadmap",
    intro:
      "Hoe het systeem veilig groeit, uitbreidt en technische schuld beheert.",
    path: "/handbook/hoofdstuk-h5",
  },
];

export type HandbookLevel = "l1" | "l2" | "l3";

export type HandbookDocument = {
  id: string;               // doc-l3-0008
  level: HandbookLevel;     // l1 | l2 | l3
  hoofdstuk: string;        // H3
  hoofdstukTitel: string;   // Doelen, scores & voortgang
  hoofdstukIntro: string;   // Introtekst voor hoofdstuk-landingspagina
  nummer: string;           // 3.4
  titel: string;            // Gedeeltelijke afronding & herstel
  path: string;             // /handbook/doc-l3-0008
};

export const handbookDocuments: HandbookDocument[] = [
  /* ───────────────── H1 ───────────────── */
  {
    id: "doc-l3-0001",
    level: "l3",
    hoofdstuk: "H1",
    hoofdstukTitel: "Kernarchitectuur",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de fundamentele architectuur van FitLifeTool, inclusief ontwerpprincipes, systeemgrenzen en uitgangspunten die richting geven aan alle verdere ontwikkeling.",
    nummer: "1.1",
    titel: "Overzicht & Principes",
    path: "/handbook/doc-l3-0001",
  },

  /* ───────────────── H2 ───────────────── */
  {
    id: "doc-l3-0002",
    level: "l3",
    hoofdstuk: "H2",
    hoofdstukTitel: "Datamodel & Persistentie",
    hoofdstukIntro:
      "Dit hoofdstuk behandelt hoe data binnen FitLifeTool is gemodelleerd, opgeslagen en beschermd, inclusief gebruikersprofielen, dagstructuur en afgeleide gegevens.",
    nummer: "2.1",
    titel: "Profielen & Autorisatie",
    path: "/handbook/doc-l3-0002",
  },
  {
    id: "doc-l3-0003",
    level: "l3",
    hoofdstuk: "H2",
    hoofdstukTitel: "Datamodel & Persistentie",
    hoofdstukIntro:
      "Dit hoofdstuk behandelt hoe data binnen FitLifeTool is gemodelleerd, opgeslagen en beschermd, inclusief gebruikersprofielen, dagstructuur en afgeleide gegevens.",
    nummer: "2.2",
    titel: "Dagstructuur & Logs",
    path: "/handbook/doc-l3-0003",
  },
  {
    id: "doc-l3-0004",
    level: "l3",
    hoofdstuk: "H2",
    hoofdstukTitel: "Datamodel & Persistentie",
    hoofdstukIntro:
      "Dit hoofdstuk behandelt hoe data binnen FitLifeTool is gemodelleerd, opgeslagen en beschermd, inclusief gebruikersprofielen, dagstructuur en afgeleide gegevens.",
    nummer: "2.3",
    titel: "Dagdoelen & Herberekening",
    path: "/handbook/doc-l3-0004",
  },

  /* ───────────────── H3 ───────────────── */
  {
    id: "doc-l3-0005",
    level: "l3",
    hoofdstuk: "H3",
    hoofdstukTitel: "Doelen, Scores & Voortgang",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool dagelijkse doelen beoordeelt, scores samenstelt en voortgang interpreteert, inclusief onvolledige dagen en herstelmechanismen.",
    nummer: "3.1",
    titel: "Fundament FitLifeScore",
    path: "/handbook/doc-l3-0005",
  },
  {
    id: "doc-l3-0006",
    level: "l3",
    hoofdstuk: "H3",
    hoofdstukTitel: "Doelen, Scores & Voortgang",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool dagelijkse doelen beoordeelt, scores samenstelt en voortgang interpreteert, inclusief onvolledige dagen en herstelmechanismen.",
    nummer: "3.2",
    titel: "Status & Kleuren",
    path: "/handbook/doc-l3-0006",
  },
  {
    id: "doc-l3-0007",
    level: "l3",
    hoofdstuk: "H3",
    hoofdstukTitel: "Doelen, Scores & Voortgang",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool dagelijkse doelen beoordeelt, scores samenstelt en voortgang interpreteert, inclusief onvolledige dagen en herstelmechanismen.",
    nummer: "3.3",
    titel: "Verwacht vs Actueel",
    path: "/handbook/doc-l3-0007",
  },
  {
    id: "doc-l3-0008",
    level: "l3",
    hoofdstuk: "H3",
    hoofdstukTitel: "Doelen, Scores & Voortgang",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool dagelijkse doelen beoordeelt, scores samenstelt en voortgang interpreteert, inclusief onvolledige dagen en herstelmechanismen.",
    nummer: "3.4",
    titel: "Dagplanning vs Herstel",
    path: "/handbook/doc-l3-0008",
  },
  {
    id: "doc-l3-0009",
    level: "l3",
    hoofdstuk: "H3",
    hoofdstukTitel: "Doelen, Scores & Voortgang",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool dagelijkse doelen beoordeelt, scores samenstelt en voortgang interpreteert, inclusief onvolledige dagen en herstelmechanismen.",
    nummer: "3.5",
    titel: "Controle & Betrouwbaarheid",
    path: "/handbook/doc-l3-0009",
  },

  /* ───────────────── H4 ───────────────── */
  {
    id: "doc-l3-0010",
    level: "l3",
    hoofdstuk: "H4",
    hoofdstukTitel: "UI-systeem & Kaarten",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de visuele architectuur van FitLifeTool, inclusief layout-hiërarchie, kaartstructuur, state-afbakening en interactieprincipes.",
    nummer: "4.1",
    titel: "UI-architectuur Overzicht",
    path: "/handbook/doc-l3-0010",
  },
  {
    id: "doc-l3-0011",
    level: "l3",
    hoofdstuk: "H4",
    hoofdstukTitel: "UI-systeem & Kaarten",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de visuele architectuur van FitLifeTool, inclusief layout-hiërarchie, kaartstructuur, state-afbakening en interactieprincipes.",
    nummer: "4.2",
    titel: "Kaartsysteem & Compositie",
    path: "/handbook/doc-l3-0011",
  },
  {
    id: "doc-l3-0012",
    level: "l3",
    hoofdstuk: "H4",
    hoofdstukTitel: "UI-systeem & Kaarten",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de visuele architectuur van FitLifeTool, inclusief layout-hiërarchie, kaartstructuur, state-afbakening en interactieprincipes.",
    nummer: "4.3",
    titel: "Layout & Responsiviteit",
    path: "/handbook/doc-l3-0012",
  },
  {
    id: "doc-l3-0013",
    level: "l3",
    hoofdstuk: "H4",
    hoofdstukTitel: "UI-systeem & Kaarten",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de visuele architectuur van FitLifeTool, inclusief layout-hiërarchie, kaartstructuur, state-afbakening en interactieprincipes.",
    nummer: "4.4",
    titel: "Navigatie & Contextbewustzijn",
    path: "/handbook/doc-l3-0013",
  },
  {
    id: "doc-l3-0014",
    level: "l3",
    hoofdstuk: "H4",
    hoofdstukTitel: "UI-systeem & Kaarten",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft de visuele architectuur van FitLifeTool, inclusief layout-hiërarchie, kaartstructuur, state-afbakening en interactieprincipes.",
    nummer: "4.5",
    titel: "Visuele hiërarchie & Status",
    path: "/handbook/doc-l3-0014",
  },

  /* ───────────────── H5 ───────────────── */
  {
    id: "doc-l3-0015",
    level: "l3",
    hoofdstuk: "H5",
    hoofdstukTitel: "Uitbreidbaarheid & Roadmap",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool veilig kan worden uitgebreid, inclusief feature flags, technische schuld en compatibiliteit over versies heen.",
    nummer: "5.1",
    titel: "Kernprincipes uitbreidbaarheid",
    path: "/handbook/doc-l3-0015",
  },
  {
    id: "doc-l3-0016",
    level: "l3",
    hoofdstuk: "H5",
    hoofdstukTitel: "Uitbreidbaarheid & Roadmap",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool veilig kan worden uitgebreid, inclusief feature flags, technische schuld en compatibiliteit over versies heen.",
    nummer: "5.2",
    titel: "Feature flags & Uitrol",
    path: "/handbook/doc-l3-0016",
  },
  {
    id: "doc-l3-0017",
    level: "l3",
    hoofdstuk: "H5",
    hoofdstukTitel: "Uitbreidbaarheid & Roadmap",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool veilig kan worden uitgebreid, inclusief feature flags, technische schuld en compatibiliteit over versies heen.",
    nummer: "5.3",
    titel: "Aannames voor roadmap",
    path: "/handbook/doc-l3-0017",
  },
  {
    id: "doc-l3-0018",
    level: "l3",
    hoofdstuk: "H5",
    hoofdstukTitel: "Uitbreidbaarheid & Roadmap",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool veilig kan worden uitgebreid, inclusief feature flags, technische schuld en compatibiliteit over versies heen.",
    nummer: "5.4",
    titel: "Beheer van technische schuld",
    path: "/handbook/doc-l3-0018",
  },
  {
    id: "doc-l3-0019",
    level: "l3",
    hoofdstuk: "H5",
    hoofdstukTitel: "Uitbreidbaarheid & Roadmap",
    hoofdstukIntro:
      "Dit hoofdstuk beschrijft hoe FitLifeTool veilig kan worden uitgebreid, inclusief feature flags, technische schuld en compatibiliteit over versies heen.",
    nummer: "5.5",
    titel: "Stabiliteit vs Innovatie",
    path: "/handbook/doc-l3-0019",
  },
];

/* ───────────────── Helpers ───────────────── */

export function getDocumentByPath(pathname: string) {
  return handbookDocuments.find((doc) => doc.path === pathname);
}

export function getDocumentsByHoofdstuk(hoofdstuk: string) {
  return handbookDocuments.filter((doc) => doc.hoofdstuk === hoofdstuk);
}
