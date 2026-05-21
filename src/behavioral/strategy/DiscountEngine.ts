import type { DiscountContext } from './DiscountContext';
import type { DiscountStrategy } from './DiscountStrategy';

export interface DiscountResult {
  amount: number;
  breakdown: string[];
}

export class DiscountEngine {
  private strategies: DiscountStrategy[];

  constructor(strategies: DiscountStrategy[]) {
    this.strategies = [...strategies];
  }

  /** Extend behavior at runtime without editing existing strategy classes. */
  addStrategy(strategy: DiscountStrategy): void {
    if (this.strategies.some((s) => s.id === strategy.id)) return;
    this.strategies.push(strategy);
  }

  removeStrategy(id: string): void {
    this.strategies = this.strategies.filter((s) => s.id !== id);
  }

  calculate(context: DiscountContext): DiscountResult {
    const breakdown: string[] = [];
    let amount = 0;

    for (const strategy of this.strategies) {
      const slice = strategy.calculate(context);
      if (slice > 0) {
        amount += slice;
        breakdown.push(strategy.getLabel());
      }
    }

    return {
      amount: Math.min(amount, context.subtotal),
      breakdown,
    };
  }
}
