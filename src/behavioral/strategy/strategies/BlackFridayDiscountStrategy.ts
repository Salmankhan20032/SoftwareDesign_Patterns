import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

/**
 * OCP demo — new behavior added as a new class only.
 * Registered at runtime via Cart.enableBlackFriday(); Cart.calculateDiscount is unchanged.
 */
export class BlackFridayDiscountStrategy implements DiscountStrategy {
  readonly id = 'black-friday';

  calculate(context: DiscountContext): number {
    const clothingTotal = context.lines
      .filter((line) => line.getProduct().category === 'clothing')
      .reduce((sum, line) => sum + line.getLineTotal(), 0);
    return clothingTotal * 0.12;
  }

  getLabel(): string {
    return 'Black Friday: 12% off clothing';
  }
}
