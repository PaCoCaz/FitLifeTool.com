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

1. Create or modify features on the `develop` branch.
2. Test all changes.
3. Merge into `main` only after verification.
4. Vercel automatically deploys `main` to production.

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
components/
lib/
public/
supabase/
types/

AGENTS.md
README.md
```

| Path | Description |
|------|-------------|
| `app/` | Next.js App Router pages |
| `components/` | Reusable UI components |
| `lib/` | Shared utilities, hooks and providers |
| `public/` | Static assets |
| `supabase/` | Database migrations, SQL and configuration |
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

---

# License

Private project.

Copyright © FitLifeTool.