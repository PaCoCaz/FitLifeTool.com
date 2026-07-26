# FitLifeTool

FitLifeTool is a multilingual health and nutrition platform built with **Next.js**, **TypeScript** and **Supabase**.

The application helps users build healthier habits by tracking:

- 🥗 Nutrition
- 💧 Hydration
- 🏃 Activity
- ⭐ FitLifeScore

FitLifeTool is designed with a strong focus on maintainability, scalability and multilingual support.

---

# Technology

The project is built using:

- Next.js (App Router)
- TypeScript
- Supabase
- Tailwind CSS
- Vercel

---

# Development

## Install dependencies

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Git Workflow

The project uses two primary branches.

| Branch | Purpose |
|---------|---------|
| `main` | Production (live on Vercel) |
| `develop` | Active development |

### Development process

1. Start from a clean, up-to-date `develop` branch.
2. Implement and validate changes locally.
3. Review the changed and staged files before committing.
4. Push development only to `origin/develop`.
5. Release to `main` only after explicit approval and with a fast-forward merge.
6. Do not create a merge commit, rebase or force push as an alternative.
7. Vercel automatically deploys `main` to production.
8. Verify the deployment metadata and the affected production flow.

The canonical release and rollback procedure is documented in Developer
Handbook section **5.7 Development & Release Workflow**.

---

# Documentation

Project documentation is maintained inside the application through the **Developer Handbook**.

The handbook is the canonical source for:

- Architecture
- Database
- Products
- Nutrition
- Hydration
- Activity
- Scoring
- Translations
- User Tracking
- UI
- Development Guidelines

---

# AI Development

AI coding agents (such as Codex) should follow the instructions defined in:

```text
AGENTS.md
```

The Developer Handbook should always be considered the primary source of project knowledge.

---

# Repository Structure

```text
app/
├── components/
├── lib/
└── (app)/handbook/
public/
supabase/
types/

AGENTS.md
README.md
```

| Path | Description |
|------|-------------|
| `app/` | Next.js App Router pages |
| `app/components/` | Reusable UI components |
| `app/lib/` | Shared utilities, hooks and providers |
| `public/` | Static assets |
| `supabase/` | The migrations currently tracked in this repository; this is not yet a complete reproducible schema history |
| `types/` | Shared TypeScript types |
| `app/(app)/handbook/` | Internal Developer Handbook |

---

# Design Principles

FitLifeTool follows several core principles throughout the project.

- Reuse existing components whenever possible.
- Keep business logic centralized.
- Never hardcode user-facing text.
- Always use the translation system.
- Keep TypeScript strict.
- Prefer maintainability over clever implementations.
- Preserve backwards compatibility whenever possible.

---

# Deployment

Production deployments are handled automatically by **Vercel**.

- `develop` → Preview Deployment
- `main` → Production Deployment

A production release requires explicit approval, a fast-forward-only update of
`main`, deployment status `Ready`, verification of the live Git SHA,
deployment ID, production alias, Function Region and a limited functional
smoke test.

---

# License

Private project.

Copyright © FitLifeTool.
