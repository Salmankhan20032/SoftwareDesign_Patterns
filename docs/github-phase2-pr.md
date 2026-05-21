# Phase 2 — Pull Request (required)

**Open PR:** https://github.com/Salmankhan20032/SoftwareDesign_Patterns/compare/phase-1...phase-2

**Base:** `phase-1` ← **Compare:** `phase-2`

## PR title

`Phase 2: Structural patterns (Decorator + Adapter)`

## PR body (copy-paste)

```markdown
## Summary

Adds two Structural patterns on top of Phase 1 creational work.

### Decorator
- `GiftWrapDecorator`, `ExtendedWarrantyDecorator` stack on `BasePricedLine`
- `Cart.addAddOn()` — new add-ons without editing cart core

### Adapter
- `LegacyPromoAdapter` translates `LegacyPromoAPI` records → `ExternalPromotion`
- Partner promos loaded async in UI

## Why these patterns?

| Pattern | Reason |
|---------|--------|
| Decorator | Combine line add-ons dynamically without subclass explosion |
| Adapter | Legacy promo API uses different field names (`promo_cd`, etc.) |

## Alternatives rejected

- **Facade** — useful later for checkout orchestration, not for API shape translation
- **Composite** — cart lines are not a tree hierarchy
- **Proxy** — no lazy-loading requirement for catalog items

## Self-review (leave as PR comments)

**Comment 1 (on `LegacyPromoAdapter.ts`):**
> Adapter correctly maps `promo_cd` → `code` and normalizes uppercase. Cart never references legacy fields — good boundary.

**Comment 2 (on `GiftWrapDecorator.ts`):**
> Consider extracting add-on fees to config/constants file before Phase 3. Stacking order is wrap → warranty; document if order must stay fixed.

## Testing

- `npm run build`
- Manual: add item → toggle gift wrap / warranty → subtotal increases
- Manual: Load partner promotions → select PARTNER-TECH on electronics
```

## After opening the PR

1. Add the two self-review comments on the files noted above (assignment requires ≥2 review comments).
2. Merge when satisfied.
