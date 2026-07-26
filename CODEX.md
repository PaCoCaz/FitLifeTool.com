# FitLifeTool - Codex Instructions

## Project Context

FitLifeTool is a multilingual health and nutrition platform built with:

- Next.js App Router
- TypeScript
- Supabase
- Tailwind CSS

The application is based around:

- Nutrition tracking
- Hydration tracking
- Activity tracking
- Adaptive goals
- FitLifeScore

FitLifeTool is not a calorie tracker only.

The core value of the platform is the interpretation layer:
raw user data and nutrition data are converted into meaningful progress,
status and coaching feedback.

---

# Primary Source of Truth

The internal Developer Handbook is the authoritative documentation.

Before changing architecture, database structures, scoring,
products or workflows:

READ THE HANDBOOK FIRST.

Relevant sections:

## Architecture

- 1.1 Overview & Principles

## Data

- 2.1 User Identity & Authorization
- 2.2 Day Structure & Logs
- 2.3 Source Data, Derived Data & Recalculation
- 2.4 Onboarding & Access Flow
- 2.5 Product Intelligence Engine
- 2.6 Product Expansion Workflow
- 2.7 Data Import & Database Synchronisation

## Scores

- 3.1 FitLifeScore Foundation
- 3.2 Status & Colors
- 3.3 Expected vs Actual Progress
- 3.4 Day Planning & Adjustment
- 3.5 Reliability & Control

## UI

- 4.x UI System

## Maintainability

- 5.x Extension Principles
- 5.7 Development & Release Workflow
- 5.8 Codex Workflow & AI Runbook
- 5.9 Testing & Validation

---

# Development Rules

## Branches

Always work on:

develop

Never commit directly to:

main

The canonical Git, validation, deployment and rollback rules are documented in
Developer Handbook sections 5.7 through 5.9.

In summary:

- start read-only and define scope before implementing
- work on a clean, current `develop`
- validate locally and review changed and staged files
- push development only to `origin/develop`
- request explicit permission for release checkout, merge, push, deployment
  and rollback
- update `main` with fast-forward operations only
- stop if fast-forward is not possible
- never use rebase or force push as a release workaround
- verify Vercel deployment metadata and the relevant production flow

---

# Code Principles

Always:

- Preserve existing architecture
- Extend before rewriting
- Reuse existing components
- Keep TypeScript strict
- Keep responsibilities separated

Avoid:

- duplicated business logic
- unnecessary abstractions
- hidden state
- hardcoded values

---

# UI Rules

Never hardcode user-facing text.

Always use:

- translation system
- existing UI components
- existing layout patterns

Follow:

- Card system
- AppShell structure
- mobile-first responsive design

---

# Database Rules

Never modify database structure unless explicitly requested.

Do not rename:

- product_key
- preparation_key
- translation keys

These identifiers may be linked to historical user data.

Prefer:

adding new data

over:

changing existing meaning

---

# Product Database Rules

Product data follows this conceptual pipeline:

External source
↓
Product management file
↓
Validation
↓
Scores
↓
Export tables
↓
Supabase


The formal canonical production workbook has not yet been designated. Import,
test and backup workbooks must not be treated as the production source without
an explicit decision.

Supabase is runtime storage.

Do not manually create derived product data.

---

# Product Sources

Preferred sources:

1. NEVO
2. Official nutrition databases
3. Manufacturer data
4. Calculated fallback values

Always preserve source metadata.

---

# Product Expansion

When adding products:

Update:

- PRODUCTS
- PRODUCT_TRANSLATIONS
- PRODUCT_PREPARATIONS
- PRODUCT_SCORES
- PORTIONS

Use export tables for database import.

Never bypass the calculation workflow.

---

# Nutrition Scoring

FitLifeTool does not use a generic health score.

Scores depend on user goals:

- lose weight
- maintain weight
- gain weight

The same product can have different scores depending on context.

Do not modify:

- scoring formulas
- modifiers
- labels
- weighting

unless explicitly requested.

---

# FitLifeScore

FitLifeScore is proprietary.

Important:

- Nutrition weight: 40%
- Hydration weight: 30%
- Activity weight: 30%

Activity influences Nutrition by increasing the available calorie budget.

Preserve this interaction.

---

# Status Logic

Status is more important than score.

Rules:

Green:
on schedule or completed

Orange:
slightly behind

Red:
significantly behind

Colors represent system state, not decoration.

---

# AI Restrictions

Codex may:

- add products
- suggest translations
- prepare imports
- improve code quality
- find bugs

Codex must NOT:

- redesign architecture
- replace scoring logic
- change database meaning
- remove existing workflows

without explicit approval.

Codex must also:

- avoid exposing secrets, tokens, cookies or passwords
- use temporary directories for temporary scripts where possible
- remove temporary measurement and debug code after use
- report the current branch, commit and worktree after risky Git or deployment
  steps
- avoid changing production data for tests unless explicitly permitted
- restore test data through existing safe functionality where possible
- avoid direct database repair of test data without explicit permission

---

# When uncertain

Ask for clarification.

Never guess business rules.
