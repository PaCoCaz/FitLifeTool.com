// app/handbook/handbookRegistry.ts

/* ───────────────── Types ───────────────── */

export type HandbookLevel = "l1" | "l2" | "l3";

export type HoofdstukMeta = {
  id: string;        // H1, H2, ...
  titel: string;
  intro: string;
  path: string;
};

export type HandbookDocument = {
  id: string;               // doc-l3-0008
  level: HandbookLevel;     // l1 | l2 | l3
  hoofdstuk: string;        // H3
  nummer: string;           // 3.4
  titel: string;            // Dagplanning vs Herstel
  path: string;             // /handbook/doc-l3-0008

  isStart?: boolean;        // ← A1: startdocument per hoofdstuk (optioneel)
};

/* ───────────────── Hoofdstukken ───────────────── */

export const hoofdstukken: HoofdstukMeta[] = [
  {
    id: "H1",
    titel: "Kernarchitectuur",
    intro:
      "Fundamentele ontwerpkeuzes en architecturale principes waarop FitLifeTool is gebouwd.",
    path: "/handbook/hoofdstuk/h1",
  },
  {
    id: "H2",
    titel: "Datamodel & Persistentie",
    intro:
      "Entiteiten, relaties en de dag-centrische datalaag.",
    path: "/handbook/hoofdstuk/h2",
  },
  {
    id: "H3",
    titel: "Doelen, Scores & Voortgang",
    intro:
      "Hoe FitLifeTool voortgang meet, interpreteert en vertaalt naar feedback.",
    path: "/handbook/hoofdstuk/h3",
  },
  {
    id: "H4",
    titel: "UI-systeem & Kaarten",
    intro:
      "Visuele architectuur, layout-hiërarchie en kaartstructuur.",
    path: "/handbook/hoofdstuk/h4",
  },
  {
    id: "H5",
    titel: "Uitbreidbaarheid & Roadmap",
    intro:
      "Groei, feature flags, technische schuld en stabiliteit.",
    path: "/handbook/hoofdstuk/h5",
  },
];

/* ───────────────── Documenten ───────────────── */

export const handbookDocuments: HandbookDocument[] = [

  /* ─────────────── H1 ─────────────── */
  {
    id: "doc-l3-0001",
    level: "l3",
    hoofdstuk: "H1",
    nummer: "1.1",
    titel: "Overzicht & Principes",
    path: "/handbook/doc-l3-0001",
    isStart: true, // ← A1
  },

  /* ─────────────── H2 ─────────────── */
  {
    id: "doc-l3-0002",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.1",
    titel: "Profielen & Autorisatie",
    path: "/handbook/doc-l3-0002",
    isStart: true, // ← A1
  },
  {
    id: "doc-l3-0003",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.2",
    titel: "Dagstructuur & Logs",
    path: "/handbook/doc-l3-0003",
  },
  {
    id: "doc-l3-0004",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.3",
    titel: "Dagdoelen & Herberekening",
    path: "/handbook/doc-l3-0004",
  },
  {
    id: "doc-l3-0021",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.4",
    titel: "Auth, Onboarding & Toegang",
    path: "/handbook/doc-l3-0021",
  },

  /* ─────────────── H3 ─────────────── */
  {
    id: "doc-l3-0005",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.1",
    titel: "Fundament FitLifeScore",
    path: "/handbook/doc-l3-0005",
    isStart: true, // ← A1
  },
  {
    id: "doc-l3-0006",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.2",
    titel: "Status & Kleuren",
    path: "/handbook/doc-l3-0006",
  },
  {
    id: "doc-l3-0007",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.3",
    titel: "Verwacht vs Actueel",
    path: "/handbook/doc-l3-0007",
  },
  {
    id: "doc-l3-0008",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.4",
    titel: "Dagplanning vs Herstel",
    path: "/handbook/doc-l3-0008",
  },
  {
    id: "doc-l3-0009",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.5",
    titel: "Controle & Betrouwbaarheid",
    path: "/handbook/doc-l3-0009",
  },

  /* ─────────────── H4 ─────────────── */
  {
    id: "doc-l3-0010",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.1",
    titel: "UI-architectuur Overzicht",
    path: "/handbook/doc-l3-0010",
    isStart: true, // ← A1
  },
  {
    id: "doc-l3-0011",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.2",
    titel: "Kaartsysteem & Compositie",
    path: "/handbook/doc-l3-0011",
  },
  {
    id: "doc-l3-0012",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.3",
    titel: "Layout & Responsiviteit",
    path: "/handbook/doc-l3-0012",
  },
  {
    id: "doc-l3-0013",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.4",
    titel: "Navigatie & Contextbewustzijn",
    path: "/handbook/doc-l3-0013",
  },
  {
    id: "doc-l3-0014",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.5",
    titel: "Visuele hiërarchie & Status",
    path: "/handbook/doc-l3-0014",
  },

  /* ─────────────── H5 ─────────────── */
  {
    id: "doc-l3-0015",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.1",
    titel: "Kernprincipes uitbreidbaarheid",
    path: "/handbook/doc-l3-0015",
    isStart: true, // ← A1
  },
  {
    id: "doc-l3-0016",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.2",
    titel: "Feature flags & Uitrol",
    path: "/handbook/doc-l3-0016",
  },
  {
    id: "doc-l3-0017",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.3",
    titel: "Aannames voor roadmap",
    path: "/handbook/doc-l3-0017",
  },
  {
    id: "doc-l3-0018",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.4",
    titel: "Beheer van technische schuld",
    path: "/handbook/doc-l3-0018",
  },
  {
    id: "doc-l3-0019",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.5",
    titel: "Stabiliteit vs Innovatie",
    path: "/handbook/doc-l3-0019",
  },
  {
    id: "doc-l3-0020",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.6",
    titel: "De opbouw van het handboek",
    path: "/handbook/doc-l3-0020",
  },
];

/* ───────────────── Helpers ───────────────── */

export function getDocumentsByHoofdstuk(hoofdstuk: string) {
  return handbookDocuments.filter((doc) => doc.hoofdstuk === hoofdstuk);
}

export function getHoofdstukById(id: string) {
  return hoofdstukken.find((h) => h.id === id);
}

export function getDocumentByPath(pathname: string) {
  return handbookDocuments.find((doc) => doc.path === pathname);
}
