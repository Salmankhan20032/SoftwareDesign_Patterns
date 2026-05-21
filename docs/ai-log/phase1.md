# AI log — Phase 1 (Creational)

## Session 1 — Pattern selection

**Prompt:**

> Phase 1 needs Creational patterns for an e-commerce cart where `addItem` took raw primitives and built Products inside Cart. Which creational patterns fit best? Compare Factory Method vs Abstract Factory vs Builder for this codebase.

**AI summary:**

- **Factory Method** — best fit: `Cart` should not construct `Product`; a `CatalogProductFactory` can own `createById`.
- **Abstract Factory** — overkill unless we have multiple incompatible product families (e.g. physical vs digital catalogs).
- **Builder** — useful for optional cart setup (student flag, loyalty tier) without a 5-argument `Cart` constructor.
- **Singleton** for cart — discouraged (global state, bad for React/testing).

**What I implemented:**

- `ProductFactory` + `CatalogProductFactory` (Factory Method)
- `CartLineFactory` (factory for line assembly)
- `CartBuilder` (Builder for cart initialization)

**Same or different from AI?**

Same direction. I skipped Abstract Factory and Singleton on purpose: one catalog source is enough for this assignment scope.

---

## Session 2 — Code review

**Prompt:**

> Review `Cart.ts` and `CatalogProductFactory.ts` after Phase 1 refactor. Any remaining creational smells?

**AI summary:**

- UI still imports `CATALOG` for display only — acceptable; cart adds via `addFromCatalog(id)`.
- Suggested a future `ApiProductFactory` for Phase 2 Adapter — good note, not implemented yet.
- Warned against putting discount factories in Phase 1 (belongs in Strategy, Phase 3).

**What I changed after review:**

- Factory returns `{ ...template }` copy so catalog entries are not mutated from the cart.
- Removed `console.log` from cart add path (minor cleanup while touching `addFromCatalog`).

---

## Reflection

| Question | Answer |
|----------|--------|
| Would Phase 1 take longer without AI? | ~1–2 hours longer for pattern naming and folder layout. |
| Where could AI mislead? | Pushing Abstract Factory or Singleton too early. |
| What I owned | Commit split, issue text, and keeping discounts in Cart until Phase 3. |
