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
- Easy to swap `CatalogProductFactory` for `ApiProductFactory` later

**Diagram:** [docs/diagrams/phase1-class.md](./docs/diagrams/phase1-class.md)

---

### 2. Builder

**Where:** `src/creational/CartBuilder.ts`; `App.tsx` uses `new CartBuilder().withCatalog(CATALOG).build()`.

**Why:** Cart needs factories plus optional flags (student, loyalty). A Builder avoids a telescoping constructor.

**What we gained:** Fluent setup (`asStudent()`, `withLoyaltyTier()`) without polluting `Cart` construction.

---

## Phase 2 — Structural

### 1. Decorator

**Where:** `src/structural/decorator/` — `BasePricedLine`, `GiftWrapDecorator`, `ExtendedWarrantyDecorator`; `Cart.addAddOn()`.

**Why:** Add-ons (gift wrap, warranty) should stack per line without subclass explosion (`CartLineWithGiftWrap`, `CartLineWithWarranty`, …) or editing `Cart` for each new add-on.

**What we gained:**

- New add-on = new decorator class; `Cart` only wraps the line
- Subtotal uses `getLineTotal()` — add-on fees flow into totals automatically
- UI toggles add-ons per line with checkboxes

**Alternatives rejected:**

- **Subclassing** — combinatorial classes for each add-on mix
- **Flags on CartLine** — another growing `if` chain inside Cart (same smell as discounts)

---

### 2. Adapter

**Where:** `src/structural/adapter/LegacyPromoAdapter.ts` adapts `external/LegacyPromoAPI.ts` to `PromotionProvider`.

**Why:** Partner API uses `promo_cd`, `disc_pct`, `flat_amt` — incompatible with our cart. Adapter translates once; Cart consumes `ExternalPromotion`.

**What we gained:**

- Cart never imports legacy field names
- Can mock `PromotionProvider` in tests
- “Load partner promotions” button demonstrates async integration

**Alternatives rejected:**

- **Facade** — good for a future `CheckoutFacade` over cart + payment + shipping; wrong primary tool for field-name translation
- **Bridge** — no runtime switching between two parallel hierarchies of promos

**Diagram:** [docs/diagrams/phase2-class.md](./docs/diagrams/phase2-class.md)

---

## Phase 3 — Behavioral

_To be completed on `phase-3` branch._
