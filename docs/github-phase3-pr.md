# Phase 3 — Final merge PR

**Open:** https://github.com/Salmankhan20032/SoftwareDesign_Patterns/compare/main...phase-3

**Title:** `Phase 3: Behavioral patterns, CI, and final architecture (merge evolving system)`

**Body:**

```markdown
## Summary

Completes the Evolving System assignment for **Topic D — E-Commerce Cart**.

### Behavioral patterns
- **Strategy** — `DiscountEngine` + discount strategy classes; removes hardcoded `calculateDiscount` if-chain
- **Observer** — `Cart.subscribe` + `useCartObserver` for UI updates
- **Command** — `CommandInvoker` with undo for add item / student discount

### OCP demonstration
- `BlackFridayDiscountStrategy` added via `enableBlackFriday()` without modifying existing strategies

### CI
- `.github/workflows/ci.yml` — build + Vitest

### Documentation
- Updated README with architecture diagram and full pattern list
- `PATTERNS.md`, `docs/ai-log/phase3.md`, `docs/diagrams/phase3-architecture.md`

## All patterns (course deliverable)

| Phase | Patterns |
|-------|----------|
| 1 | Factory Method, Builder |
| 2 | Decorator, Adapter |
| 3 | Strategy, Observer, Command |

## Test plan

- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Add items, toggle Black Friday on clothing, verify discount breakdown
- [ ] Undo after adding item
```

Merge to `main` when ready for LMS submission.
