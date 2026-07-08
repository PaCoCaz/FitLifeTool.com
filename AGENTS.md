# FitLifeTool - AI Agent Instructions

## Purpose

FitLifeTool is a multilingual health and nutrition platform built with:

- Next.js App Router
- TypeScript
- Supabase
- Tailwind CSS

The application focuses on:

- Nutrition
- Hydration
- Activity
- FitLifeScore

FitLifeTool is a day-driven lifestyle system.
The goal is coaching and adaptive feedback, not only tracking.

---

# Documentation Priority

The internal Developer Handbook is the canonical source of truth.

Location:

app/(app)/handbook/

Before modifying:

- architecture
- database
- scoring
- UI patterns
- data flow

consult the handbook first.

If implementation and documentation conflict:
ask before changing.

Do not invent new patterns.

---

# Core Architecture Rules

## Day-based model

A calendar day is the primary aggregation unit.

A day is derived from logs.

Do not introduce separate day state unless explicitly requested.

---

## Logs

User actions are stored as logs.

Examples:

- nutrition_logs
- hydration_logs
- activity_logs
- weight_logs

Principles:

- logs are source data
- logs are append-only
- derived values are recalculated

Do not store calculated progress or scores.

---

# Derived Data

The following are derived:

- progress
- status
- FitLifeScore
- dashboard values

They should always be reproducible from:

- user profile
- goals
- logs
- reference data

---

# FitLifeScore Rules

FitLifeScore is proprietary.

Never change scoring logic unless explicitly instructed.

The system consists of:

- Nutrition
- Hydration
- Activity

Weights:

- Nutrition: 40%
- Hydration: 30%
- Activity: 30%

Scores are numeric indicators.

Status is separate from score.

Do not determine live status only from numeric score.

---

# Domain Interaction Rules

Domains have independent responsibility but can influence each other.

Important:

Activity directly increases the available Nutrition budget.

Flow:

Activity
↓
activity calories
↓
Nutrition daily limit adjustment
↓
NutritionScore recalculation

Do not remove this relationship.

---

# Expected vs Actual Progress

FitLifeTool compares:

expected progress
=
where the user should approximately be based on time

actual progress
=
what the user has logged

Status is based on this comparison.

Being behind is not failure.
Users may intentionally be behind temporarily.

---

# Status System

Status colors are semantic.

Rules:

Green:
- on schedule
- goal reached

Orange:
- slightly behind

Red:
- significantly behind

Blue:
- goal/reference indication only

Do not use blue as "on track".

FitLifeScore status aggregation:

Red has priority.
Then orange.
Green only when all domains are green.

---

# User Interface Rules

FitLifeTool is mobile-first.

Use:

- responsive layouts
- existing grid systems
- existing cards

Reuse before creating.

Preferred:

extend existing components

Avoid:

duplicating components
creating special-case layouts

---

# Cards

Cards are independent domain components.

A card:

- calculates or receives its own domain status
- publishes score/status
- owns its domain presentation

FitLifeScore aggregates.

Do not duplicate card logic inside FitLifeScore.

---

# Translations

Never hardcode user-facing text.

Always use:

- translation keys
- existing language system

All new user-facing features must support multilingual expansion.

---

# Database Rules

Do not modify database schema unless explicitly requested.

Never rename:

- product_key
- existing identifiers
- translation keys

Preserve:

- relations
- historical data
- compatibility

Prefer adding over replacing.

---

# Product Database

Reference data is separated from user data.

Products, portions, translations and nutrition models are reference data.

User logs reference these.

Never mix user state into reference tables.

---

# Development Workflow

Branches:

develop:
active development

main:
production

Rules:

- work on develop
- never commit directly to main
- keep changes small
- maintain backwards compatibility

---

# Code Style

Prefer:

- clarity
- explicit logic
- maintainability

Avoid:

- clever abstractions
- hidden state
- duplicated business rules

---

# When uncertain

Ask before:

- changing architecture
- changing scoring
- changing database structure
- introducing new patterns