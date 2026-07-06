# FitLifeTool - AI Agent Instructions

## Purpose

FitLifeTool is a multilingual health and nutrition platform built with:

- Next.js (App Router)
- TypeScript
- Supabase
- Tailwind CSS

The application focuses on nutrition, hydration, activity and the proprietary FitLifeScore.

---

## Documentation

FitLifeTool contains an internal **Developer Handbook**.

Before making architectural, database or scoring changes, always consult the relevant handbook documentation.

If documentation is missing or unclear, ask for clarification instead of making assumptions.

---

## General Principles

- Preserve the existing architecture.
- Reuse existing components before creating new ones.
- Prefer extending existing functionality over duplication.
- Keep TypeScript strict.
- Keep code readable and maintainable.
- Follow existing naming conventions.
- Keep commits focused on a single change.

---

## User Interface

- Never hardcode user-facing text.
- Always use the translation system.
- Reuse existing UI components.
- Follow the existing design system.
- Maintain consistent spacing, typography and colors.

---

## Database

- Never modify the database schema unless explicitly requested.
- Never rename existing `product_key` values.
- Preserve referential integrity.
- Follow the documented database structure.

---

## Scoring

FitLifeScore is proprietary.

Never modify scoring logic unless explicitly instructed.

Always preserve existing calculations.

---

## Development Workflow

- Work on the `develop` branch unless instructed otherwise.
- Never merge directly into `main`.
- Keep changes backwards compatible whenever possible.
- Prefer small incremental improvements.

---

## When in doubt

If functionality or documentation is unclear, ask before making architectural changes.