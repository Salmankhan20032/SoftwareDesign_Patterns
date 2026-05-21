# Design Patterns Documentation

## Phase 0

No design patterns applied — baseline naive implementation for comparison.

---

## Phase 1 — Creational

### 1. Factory Method

**Where:** `src/creational/ProductFactory.ts`, `CatalogProductFactory.ts`, `CartLineFactory.ts`; used by `Cart.addFromCatalog()`.

**Why:** Phase 0 `Cart.addItem()` accepted five primitives and built `Product` objects internally (problem #3 in PROBLEMS.md). Creation logic is now centralized; `Cart` only receives fully built products/lines.

**What we gained:**

- Single place to change how catalog products become cart products
- UI calls `addFromCatalog(productId)` — no manual field passing
- Easy to add `ApiProductFactory` later without editing `Cart`

**Before → After:** See [docs/diagrams/phase1-class.md](./docs/diagrams/phase1-class.md).

---

### 2. Builder

**Where:** `src/creational/CartBuilder.ts`; `App.tsx` uses `new CartBuilder().withCatalog(CATALOG).build()`.

**Why:** Cart needs factories plus optional flags (student, loyalty). A Builder avoids a telescoping constructor and keeps setup readable.

**What we gained:**

- Fluent setup: `asStudent()`, `withLoyaltyTier()`, `withProductFactory(custom)`
- `Cart` constructor stays focused on runtime dependencies only

**Trade-off:** For a tiny app, `new Cart(factory, lineFactory)` would suffice; Builder pays off when checkout presets grow (guest vs member carts).

---

## Phase 2 — Structural

_To be completed on `phase-2` branch._

## Phase 3 — Behavioral

_To be completed on `phase-3` branch._
