# Phase 0 — Design Problem Analysis

Analysis of the initial naive e-commerce cart (`src/domain/Cart.ts`).

## Identified Problems (minimum 5)

### 1. Discount logic embedded in the Cart class (Open/Closed violation)

All discount rules live inside `calculateDiscount()` as a growing chain of `if` statements. Adding a new promotion (e.g. Black Friday) means editing the Cart class and retesting unrelated behavior.

### 2. God class — Cart does too many jobs

`Cart` creates products, stores lines, applies coupons, computes loyalty tiers, logs to the console, and formats discount notes. A single change to product structure or pricing policy ripples through one large class.

### 3. Product creation mixed with cart operations

`addItem()` accepts raw primitives (`productId`, `name`, `price`, `category`) and builds `Product` objects internally. Catalog data is duplicated at the UI layer while the cart re-constructs entities — no single source of truth for how products are created.

### 4. Duplicated discount rules (DRY violation)

Discount conditions appear in both `calculateDiscount()` and `getDiscountBreakdown()`. If one is updated and the other is not, the UI can show rules that do not match the actual total.

### 5. No extension point for external pricing services

Coupon and loyalty logic assume in-memory flags only. Integrating a third-party promotion API would require more `if` branches inside Cart instead of plugging in an adapter.

### 6. Tight coupling between UI and domain construction

React components pass catalog fields into `addItem()` manually. The presentation layer knows how to assemble domain objects, which makes testing and reuse harder.

### 7. Side effects inside domain logic

`console.log` / `console.warn` inside Cart tie business logic to the browser console, which is awkward for unit tests and server-side reuse.

---

## AI-assisted review (Phase 0)

**Prompt used:**

> This code has discount calculations hardcoded in the cart class; adding a new discount rule breaks existing code. What design problems do you see? Which design patterns could address them? Brief explanation per issue.

**AI summary of findings:**

- **Strategy** — extract each discount rule (student, bulk, loyalty, coupon) into interchangeable algorithms so new rules do not modify Cart.
- **Factory Method / Abstract Factory** — centralize product (or line-item) creation instead of building products inside `addItem()`.
- **Decorator** — wrap line items or cart totals with add-ons (gift wrap, extended warranty) without bloating Cart.
- **Observer** — notify UI or analytics when the cart changes instead of manual React `refresh()` triggers.
- **Facade** — expose a simple checkout API over cart + discounts + payment adapters.
- **Command** — support undo/redo for add/remove/coupon actions.
- **Adapter** — integrate external coupon/loyalty APIs behind a stable interface.

**My list vs AI:**

| Topic | I emphasized | AI emphasized | Match? |
|--------|----------------|---------------|--------|
| Hardcoded discounts | Yes — OCP / maintainability | Yes — Strategy | Strong match |
| Product creation in Cart | Yes | Yes — Factory | Match |
| UI coupling | Yes | Less detail | I went deeper on React boundary |
| Undo / analytics | Not in my first pass | Command, Observer | AI added useful extras for Phase 3 |
| External APIs | Yes — Adapter need | Yes — Adapter | Match |
| God class | Yes — SRP | Implied via multiple patterns | Partial match |

**Differences:** I called out duplicated logic between `calculateDiscount` and `getDiscountBreakdown` and console side effects; AI suggested Command/Observer earlier than I had planned. I agree with Strategy as the primary fix for Topic D and will reserve Creational patterns for Phase 1 (product/cart item creation) as the assignment sequence expects.

**Planned pattern map (for later phases):**

- Phase 1 (Creational): Factory Method for catalog products / cart line factories  
- Phase 2 (Structural): Decorator for cart add-ons, Adapter for external promo API (or Facade for checkout)  
- Phase 3 (Behavioral): Strategy for discounts, Observer for cart state, Command for undo — demonstrating OCP on discounts
