import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class LoyaltyDiscountStrategy implements DiscountStrategy {
  readonly id = 'loyalty';

  calculate(context: DiscountContext): number {
    if (context.customerTier === 'gold') return context.subtotal * 0.2;
    if (context.customerTier === 'silver') return context.subtotal * 0.05;
    return 0;
  }

  getLabel(): string {
    return 'Loyalty tier discount';
  }
}
