# Phase 1 — GitHub Issue & PR (manual steps)

`gh` CLI is not available in this environment. Complete these steps in the browser (takes ~2 minutes).

## 1. Open Issue

**Title:** `Product creation mixed with Cart operations (Phase 0)`

**Body:**

```markdown
## Problem (PROBLEMS.md #3)

`Cart.addItem()` accepted raw primitives and built `Product` inside Cart. UI passed catalog fields manually.

## Fix (Phase 1)

- `ProductFactory` + `CatalogProductFactory`
- `CartLineFactory`
- `Cart.addFromCatalog(id)` — no primitive construction in Cart

Closes via PR from `phase-1`.
```

Create at: https://github.com/Salmankhan20032/SoftwareDesign_Patterns/issues/new

Note the issue number (e.g. `#1`).

## 2. Open Pull Request

**Base:** `main` ← **Compare:** `phase-1`

**Title:** `Phase 1: Creational patterns (Factory Method + Builder)`

**Body:**

```markdown
Closes #ISSUE_NUMBER

## Patterns
- **Factory Method** — `CatalogProductFactory`, `CartLineFactory`
- **Builder** — `CartBuilder`

## Changes
- Removed `Cart.addItem(primitives…)` 
- Added `Cart.addFromCatalog(productId)`
- Documented in `PATTERNS.md`, UML in `docs/diagrams/phase1-class.md`

## AI log
See `docs/ai-log/phase1.md`
```

Open PR: https://github.com/Salmankhan20032/SoftwareDesign_Patterns/compare/main...phase-1

## 3. Merge

Merge the PR on GitHub so the issue auto-closes.

## Commits on `phase-1`

1. `feat: apply Factory Method for catalog product and cart line creation`
2. `feat: apply Builder for fluent cart initialization`
3. `docs(phase-1): document Factory Method, Builder, and AI reflection`
4. `refactor: extract object creation from Cart god-class responsibilities`
