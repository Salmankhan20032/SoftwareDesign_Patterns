# Evolving System — Design Patterns Assignment

**Selected topic: D — E-Commerce Cart**

I chose this topic because discount rules are a clear real-world pain point: every new promotion type tends to land in one `if` block and breaks something else. The cart is easy to demo in React (catalog, line items, totals) while still giving a strong before/after story for Strategy and OCP in Phase 3.

Discount and promotion logic is intentionally hardcoded inside the `Cart` class in Phase 0. That mirrors the assignment scenario: every new discount type forces you to edit existing cart code and risks regressions. This project evolves that design across three graded phases (Creational → Structural → Behavioral) using a React + TypeScript storefront.

---

## Current status

| Phase | Branch | Status |
|-------|--------|--------|
| 0 — Naive baseline | `main` | Complete |
| 1 — Creational | `phase-1` | Not started |
| 2 — Structural | `phase-2` | Not started |
| 3 — Behavioral | `phase-3` | Not started |

## What it does

Simple e-commerce UI: browse a catalog, add items, set student/loyalty/coupon options, and see subtotal, discount, and total. All discount rules currently live in `src/domain/Cart.ts` (Phase 0 smell).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # preview production build
```

## Repository layout

```
├── README.md
├── PATTERNS.md      # pattern documentation (updated each phase)
├── PROBLEMS.md      # Phase 0 problem analysis
├── src/
├── docs/
│   ├── diagrams/
│   └── ai-log/
└── .github/workflows/   # CI added in Phase 3
```

## Patterns (planned)

| Phase | Planned patterns |
|-------|------------------|
| 1 | Factory Method (product / line creation) |
| 2 | Decorator (add-ons), Adapter or Facade (external promo/checkout) |
| 3 | Strategy (discounts), Observer + Command (OCP demo, undo, UI sync) |

Details in [PATTERNS.md](./PATTERNS.md) as each phase lands.

## License

Academic project — Software Design Patterns course 2025–2026.
