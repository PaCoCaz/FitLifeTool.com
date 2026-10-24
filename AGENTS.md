# FitLifeTool — Agent Execution Contract

## Purpose

This file contains execution policy and guardrails for AI agents working on
FitLifeTool. It is not a second project handbook. Functional, technical and
architectural knowledge belongs in the canonical sources listed below.

## Mandatory read order

Before changing anything:

1. Read this `AGENTS.md`.
2. Read `FITLIFETOOL_CONTEXT.md`.
3. Read the official planning/progress SSOT,
   `docs/project/CORE_APPLICATION_ROADMAP.md`, and the relevant workflow before
   any development, design, validation, release or prioritization task.
4. Read the deepest relevant Developer Handbook sections in
   `app/(app)/handbook/`.
5. For product-data work, read
   `docs/product-data/PRODUCT_DATA_GOVERNANCE.md`.
6. For development, release, AI and validation workflow, follow Handbook
   5.7–5.9 and the roadmap lifecycle rules; use the designated
   `FITLIFETOOL_CHATGPT_WORKFLOW.md` where accessible.

## Project-wide roadmap and progress governance

- This policy applies to all existing and future FitLifeTool chats and Codex
  sessions. The only official Core planning and phase-progress roadmap is
  [docs/project/CORE_APPLICATION_ROADMAP.md](docs/project/CORE_APPLICATION_ROADMAP.md)
  on the canonical development branch `develop`. Do not create a competing roadmap.
- Before choosing/starting a phase, read the current roadmap and applicable
  workflow. Record the branch, commit, local documentation changes, phase
  status, priority, dependencies, existing approval and reusable evidence.
  If the current Git source is inaccessible or freshness cannot be established,
  report that before selecting a new phase. Do not silently use stale chat
  memory, uploaded copies or an older checkout as current status.
- Preserve the twelve phases, proposed execution order, owner decisions and
  approved parallel work. Do not independently reprioritize or reopen accepted
  decisions. The Handbook remains the architecture source; specific roadmaps
  and evidence registers retain their own detail evidence.
- Use PLANNED, IN PROGRESS, BLOCKED and DONE as defined in the roadmap. Keep
  implementation, local validation, develop integration, remote publication,
  Preview and Production evidence separate. Never infer DONE from code, a
  local PASS or a worktree name alone.
- During work, record relevant progress without unnecessary interim commits.
  At every phase completion, check acceptance/release criteria and whether
  roadmap status, evidence, open points and the next permitted step need
  updating. Include safe documentation maintenance in the same approved phase;
  do not introduce micro-approval rounds for ordinary authorized substeps.
- Read-only scope does not authorize documentation writes. Existing STOP,
  security, protected-worktree, staging, commit, push and deployment boundaries
  remain unchanged. Report an update blocked by those boundaries.
- Determine the next phase from the updated roadmap; do not start it without
  substantive approval. If this checkout has old instructions, consult the
  designated current develop documentation read-only; never switch or update
  protected branches/worktrees to obtain it.
- These files do not automatically update running chats, other worktrees or
  ChatGPT project settings. Report the actual accessible source/version and any
  required owner setup using the [central access guide](docs/project/README.md).

## Start read-only and define scope

- Begin read-only. Check the current branch, commit, relevant remote refs and
  working tree before editing.
- Identify existing local changes and determine whether they overlap the task.
  Never overwrite, stage, reset, stash, format or otherwise absorb unrelated
  user changes.
- Define the approved scope, relevant canonical sources, assumptions and risks
  before implementation.
- Work on `develop`. Stop and report unexpected branch, worktree, architecture
  or documentation conditions that cannot safely remain outside the task.
- Modify only the approved scope. Do not perform adjacent cleanup without
  approval.

## Architecture and business-rule guardrails

- Preserve existing architecture and responsibilities. Extend and reuse before
  rewriting or introducing a new pattern.
- Never guess business rules.
- If documentation and implementation conflict, stop and report the conflict;
  do not resolve it independently or silently rewrite documentation from code.
- Do not change scoring logic, formulas, weights, modifiers, status logic or
  product-score meaning without explicit approval.
- Do not change database schema, data semantics, relations or Supabase
  architecture without explicit approval.
- Treat audit findings as findings, not approved architecture or business
  rules.
- Preserve the day-driven model, central recalculation and separation of source
  data from derived data.
- Preserve the separation between reference data and user data.
- Keep business logic out of presentation components. Reuse existing mobile-
  first, multilingual UI and translation patterns.

## Data and identifier safety

- Protect persistent identifiers, including `product_key`, `preparation_key`,
  translation keys and identifiers referenced by historical data. Do not rename
  or change their meaning without an explicit migration decision.
- Prefer compatible additions over replacements.
- Do not modify product-data structures or synchronization semantics outside an
  explicitly approved task. Follow Handbook 2.5–2.7 and Product Data
  Governance.
- AI/Codex must never directly edit
  `Database Products FitLifeTool (master).xlsm`. Its protection does not make it
  the formally designated canonical production workbook.

## Security, test data and production

- Never expose or log secrets, tokens, cookies or passwords.
- Do not mutate production data for tests without explicit approval.
- Restore test data through existing safe functionality where possible. Do not
  repair test data directly in the database without explicit approval.
- Do not change production infrastructure, deployment configuration, Supabase
  or external payment systems unless explicitly in scope and approved.
- Keep temporary inspection, measurement and debug artifacts out of the final
  change.

## Git, release and deployment gates

- Do not create unexpected commits.
- Every Git push requires explicit permission, including pushes to
  `origin/develop` and `origin/main`.
- Checkout for release, merge, deployment and rollback each require the
  explicit approval gates in Handbook 5.7–5.9.
- Releases to `main` are fast-forward-only. Do not use merge commits, rebase,
  force push or history rewriting as a workaround.
- Stop when a required fast-forward or validation gate fails.
- After an approved risky Git, release or deployment step, report the branch,
  commit, refs, working tree, action and verification result.

## Validation and handoff

- Validate in proportion to risk and follow Handbook 5.9.
- Review the full changed-file list and diff. Before any approved commit,
  review the staged-file list and staged diff separately.
- Report warnings and distinguish new failures from pre-existing conditions.
- Do not stage, commit, push, merge or deploy unless the user explicitly
  authorizes that action.

## Documentation Impact Check

Before finishing any relevant change, determine whether it affects canonical
FitLifeTool documentation or introduces project knowledge that must be stored
canonically. Follow Handbook 5.7–5.8 and report:

```text
Documentation impact:
- None
```

or list each canonical source that requires an update.

- Not every code change needs documentation.
- Update the deepest canonical source that owns the knowledge.
- Update `FITLIFETOOL_CONTEXT.md` only when core context, terminology or the
  document router changes.
- An audit finding does not automatically become a business rule.
- New architecture or business logic becomes canonical only after explicit
  approval.
