// app/(app)/handbook/handbookRegistry.ts

/* ───────────────── Types ───────────────── */

export type HandbookLevel = "l1" | "l2" | "l3";

export type HandbookStatus =
  | "draft"
  | "review"
  | "current";

export type HoofdstukMeta = {
  id: string;
  titel: string;
  intro: string;
  path: string;
};

export type HandbookDocument = {
  id: string;
  level: HandbookLevel;
  hoofdstuk: string;
  nummer: string;
  titel: string;
  path: string;

  isStart?: boolean;

  status?: HandbookStatus;
  updated?: string;
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
    titel: "Datamodel & Applicatiearchitectuur",
    intro:
      "Entiteiten, relaties en de dag-centrische datalaag.",
    path: "/handbook/hoofdstuk/h2",
  },
  {
    id: "H3",
    titel: "Doelen, Scores & Voortgang",
    intro:
      "Het scoremodel, de voortgangslogica en de realtime feedback waarmee FitLifeTool gebruikers gedurende de dag ondersteunt.",
    path: "/handbook/hoofdstuk/h3",
  },
  {
    id: "H4",
    titel: "UI-systeem & Componentarchitectuur",
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

    isStart: true,
    status: "current",
    updated: "2026-08-22",
  },

  /* ─────────────── H2 ─────────────── */

  {
    id: "doc-l3-0002",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.1",
    titel: "Gebruikersidentiteit & Autorisatie",
    path: "/handbook/doc-l3-0002",

    isStart: true,
    status: "current",
    updated: "2026-08-27",
  },

  {
    id: "doc-l3-0003",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.2",
    titel: "Dagstructuur & Logs",
    path: "/handbook/doc-l3-0003",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0004",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.3",
    titel: "Brondata, Afgeleide data & Herberekening",
    path: "/handbook/doc-l3-0004",

    status: "current",
    updated: "2026-07-16",
  },

  {
    id: "doc-l3-0021",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.4",
    titel: "Onboarding & Toegangsflow",
    path: "/handbook/doc-l3-0021",

    status: "current",
    updated: "2026-08-27",
  },

  {
    id: "doc-l3-0022",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.5",
    titel: "Product Intelligence Engine",
    path: "/handbook/doc-l3-0022",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0023",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.6",
    titel: "Product Expansion Workflow",
    path: "/handbook/doc-l3-0023",

    status: "review",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0024",
    level: "l3",
    hoofdstuk: "H2",
    nummer: "2.7",
    titel: "Data Import & Database Synchronisatie",
    path: "/handbook/doc-l3-0024",

    status: "review",
    updated: "2026-08-22",
  },

  /* ─────────────── H3 ─────────────── */

  {
    id: "doc-l3-0005",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.1",
    titel: "Fundament van de FitLifeScore",
    path: "/handbook/doc-l3-0005",

    isStart: true,
    status: "current",
    updated: "2026-07-08",
  },

  {
    id: "doc-l3-0006",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.2",
    titel: "Status & Kleuren",
    path: "/handbook/doc-l3-0006",

    status: "current",
    updated: "2026-07-02",
  },

  {
    id: "doc-l3-0007",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.3",
    titel: "Verwachte vs Actuele Voortgang",
    path: "/handbook/doc-l3-0007",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0008",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.4",
    titel: "Dagplanning & Bijsturen",
    path: "/handbook/doc-l3-0008",

    status: "current",
    updated: "2026-07-02",
  },

  {
    id: "doc-l3-0009",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.5",
    titel: "Controle & Betrouwbaarheid",
    path: "/handbook/doc-l3-0009",

    status: "current",
    updated: "2026-07-02",
  },

  {
    id: "doc-l3-0028",
    level: "l3",
    hoofdstuk: "H3",
    nummer: "3.6",
    titel: "Activity-registratie",
    path: "/handbook/doc-l3-0028",

    status: "review",
    updated: "2026-07-26",
  },

  /* ─────────────── H4 ─────────────── */

  {
    id: "doc-l3-0010",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.1",
    titel: "UI-architectuur Overzicht",
    path: "/handbook/doc-l3-0010",

    isStart: true,
    status: "review",
    updated: "2026-07-26",
  },

  {
    id: "doc-l3-0011",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.2",
    titel: "Kaartsysteem & Compositie",
    path: "/handbook/doc-l3-0011",

    status: "current",
    updated: "2026-07-08",
  },

  {
    id: "doc-l3-0012",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.3",
    titel: "Layout & Responsiviteit",
    path: "/handbook/doc-l3-0012",

    status: "current",
    updated: "2026-07-26",
  },

  {
    id: "doc-l3-0013",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.4",
    titel: "Navigatie & Contextbewustzijn",
    path: "/handbook/doc-l3-0013",

    status: "current",
    updated: "2026-07-06",
  },

  {
    id: "doc-l3-0014",
    level: "l3",
    hoofdstuk: "H4",
    nummer: "4.5",
    titel: "Visuele hiërarchie & Status",
    path: "/handbook/doc-l3-0014",

    status: "current",
    updated: "2026-07-06",
  },

  /* ─────────────── H5 ─────────────── */

  {
    id: "doc-l3-0015",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.1",
    titel: "Kernprincipes uitbreidbaarheid",
    path: "/handbook/doc-l3-0015",

    isStart: true,
    status: "current",
    updated: "2026-07-06",
  },

  {
    id: "doc-l3-0016",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.2",
    titel: "Feature Flags & Gecontroleerde Uitrol",
    path: "/handbook/doc-l3-0016",

    status: "current",
    updated: "2026-07-16",
  },

  {
    id: "doc-l3-0017",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.3",
    titel: "Roadmap & Ontwikkelvisie",
    path: "/handbook/doc-l3-0017",

    status: "current",
    updated: "2026-07-06",
  },

  {
    id: "doc-l3-0018",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.4",
    titel: "Beheer van technische schuld",
    path: "/handbook/doc-l3-0018",

    status: "current",
    updated: "2026-07-06",
  },

  {
    id: "doc-l3-0019",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.5",
    titel: "Stabiliteit & Innovatie",
    path: "/handbook/doc-l3-0019",

    status: "current",
    updated: "2026-07-06",
  },

  {
    id: "doc-l3-0020",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.6",
    titel: "De opbouw van het handboek",
    path: "/handbook/doc-l3-0020",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0025",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.7",
    titel: "Development & Release Workflow",
    path: "/handbook/doc-l3-0025",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0026",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.8",
    titel: "Codex Workflow & AI Runbook",
    path: "/handbook/doc-l3-0026",

    status: "current",
    updated: "2026-08-22",
  },

  {
    id: "doc-l3-0027",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.9",
    titel: "Testing & Validatie",
    path: "/handbook/doc-l3-0027",

    status: "current",
    updated: "2026-07-26",
  },

  {
    id: "doc-l3-0029",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.10",
    titel: "Legal & Consumer Compliance",
    path: "/handbook/doc-l3-0029",

    status: "review",
    updated: "2026-08-25",
  },

  {
    id: "doc-l3-0030",
    level: "l3",
    hoofdstuk: "H5",
    nummer: "5.11",
    titel: "Public Web, SEO & Performance Architecture",
    path: "/handbook/doc-l3-0030",

    status: "current",
    updated: "2026-08-19",
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
