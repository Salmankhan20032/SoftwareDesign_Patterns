# AI log — Phase 2 (Structural)

## Session 1 — Adapter vs Facade

**Prompt:**

> For an e-commerce cart, I need a Structural pattern to integrate a third-party promotion API that returns `promo_cd` and `disc_pct` instead of our domain shape. Is Adapter or Facade the right choice? Explain the difference.

**AI answer (summary):**

- **Adapter** — converts one incompatible interface into another; best when a legacy/external API already exists.
- **Facade** — simplifies a *subsystem* of multiple classes behind one entry point; not primarily for format translation.

**What I implemented:** `LegacyPromoAdapter` implementing `PromotionProvider`.

**Where AI was incomplete:** It suggested Facade could “wrap checkout + payment + promos” in the same breath. That is a valid later addition, but for *format mismatch* Adapter is the precise pattern. I rejected Facade for promo integration to avoid a vague god-object.

---

## Session 2 — Decorator vs subclassing add-ons

**Prompt:**

> Should gift wrap and extended warranty be subclasses of `CartLine` or Decorators?

**AI answer:** Decorator — combine add-ons dynamically (wrap + warranty) without combinatorial subclasses (`CartLineWithGiftWrapAndWarranty`, etc.).

**What I implemented:** `GiftWrapDecorator`, `ExtendedWarrantyDecorator` stacking on `BasePricedLine`.

**What I verified myself:** `getSubtotal()` sums `PricedLine.getLineTotal()` so decorators affect totals without touching discount `if` blocks yet.

---

## Session 3 — AI mistake caught

**AI suggestion:** “Put partner discount inside `calculateDiscount()` as another `if` on `promo_cd`.”

**Why rejected:** That repeats Phase 0 smell. I added `calculateExternalPromoDiscount()` fed only by adapted `ExternalPromotion` objects — Cart never reads `promo_cd` directly.

---

## Reflection

| Question | Answer |
|----------|--------|
| Adapter vs Facade here? | Adapter for legacy API; Facade deferred until checkout orchestration grows. |
| Time saved with AI? | ~45 minutes on pattern naming and diagram wording. |
| Risk | AI over-used Facade as a blanket “simplify everything” tool. |
