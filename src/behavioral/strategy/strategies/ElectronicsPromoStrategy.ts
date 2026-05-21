import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class ElectronicsPromoStrategy implements DiscountStrategy {
  readonly id = 'electronics-200';

  calculate(context: DiscountContext): number {
    const hasElectronics = context.lines.some(
      (line) => line.getProduct().category === 'electronics',
    );
    if (context.subtotal > 200 && hasElectronics) return 25;
    return 0;
  }

  getLabel(): string {
    return 'Electronics over $200: $25 off';
  }
}
