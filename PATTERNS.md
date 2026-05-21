# Design Patterns Documentation

**Topic D — E-Commerce Cart** · Evolving System assignment 2025–2026

---

## Phase 0

No patterns — naive `Cart` with hardcoded `calculateDiscount()` and `addItem(primitives…)`.

---

## Phase 1 — Creational

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Factory Method** | `src/creational/*Factory*` | Product & cart line creation |
| **Builder** | `src/creational/CartBuilder.ts` | Fluent cart setup |

Diagram: [phase1-class.md](./docs/diagrams/phase1-class.md)

---

## Phase 2 — Structural

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Decorator** | `src/structural/decorator/` | Gift wrap & warranty add-ons per line |
| **Adapter** | `src/structural/adapter/LegacyPromoAdapter.ts` | Legacy `promo_cd` API → `ExternalPromotion` |

Diagram: [phase2-class.md](./docs/diagrams/phase2-class.md)

---

## Phase 3 — Behavioral

### 1. Strategy (discounts) — **Open/Closed Principle**

**Where:** `src/behavioral/strategy/`

**Before:** `Cart.calculateDiscount()` was a growing `if` chain (Phase 0 pain).

**After:** `DiscountEngine` runs `DiscountStrategy[]`. Each rule is its own class (`StudentDiscountStrategy`, `BulkDiscountStrategy`, …).

**OCP demo:** `BlackFridayDiscountStrategy.ts` is added at runtime via `cart.enableBlackFriday()` — **no edits** to existing strategy classes or `calculateDiscount()` logic in Cart.

```typescript
// New behavior — new file only
export class BlackFridayDiscountStrategy implements DiscountStrategy { ... }
cart.enableBlackFriday(); // registers strategy on engine
```

**Gain:** New promotions = new strategy class + `engine.addStrategy()`, not fragile conditionals.

---

### 2. Observer (cart → UI sync)

**Where:** `CartObserver`, `Cart.subscribe()`, `useCartObserver` hook

**Why:** React no longer needs manual `refresh()` after every cart mutation.

**Gain:** Domain notifies subscribers; UI stays decoupled from cart internals.

---

### 3. Command (undo)

**Where:** `CommandInvoker`, `AddItemCommand`, `SetStudentDiscountCommand`

**Why:** Reversible actions with history stack for “Undo” in the header.

**Gain:** Extensible action log; can add `ApplyCouponCommand` without changing invoker core.

---

**Final diagram:** [phase3-architecture.md](./docs/diagrams/phase3-architecture.md)
