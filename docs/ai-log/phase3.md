# AI log — Phase 3 (Behavioral)

## Pair programming session (~35 min)

**Topics discussed with AI:**

1. Extracting `calculateDiscount()` into Strategy without breaking Phase 2 decorators/adapter flow  
2. Whether Observer belongs in React state or Cart domain  
3. Command scope: undo only “add item” vs all cart mutations  
4. CI choice: `npm run build` only vs Vitest unit tests on `DiscountEngine`

**How we proceeded:**

- Defined `DiscountContext` as a snapshot so strategies stay pure functions  
- Cart calls `notify()` after mutations; `useCartObserver` replaces manual `refresh()`  
- `CommandInvoker` + `AddItemCommand` / `SetStudentDiscountCommand` for undo demo  
- `BlackFridayDiscountStrategy` added in **new file** + `enableBlackFriday()` — OCP proof

**AI suggestion rejected:**

> “Use a single `switch` inside `DiscountEngine` on strategy type names.”

That would recreate Phase 0 inside the engine. Kept polymorphic `calculate()` on each strategy.

**AI gap caught:**

AI initially put React `setState` inside `Cart`. Moved notifications to `CartObserver` interface — domain stays framework-agnostic.

---

## Reflection questions (assignment)

| Question | Answer |
|----------|--------|
| How long without AI? | Estimated 4–6 hours for Strategy + Command + CI wiring. |
| Where did AI mislead? | Suggested merging external promo back into Cart `if` blocks instead of `ExternalPromoStrategy`. |
| What I owned | Test cases for OCP (`addStrategy(BlackFriday)`), commit split, final README diagram. |
