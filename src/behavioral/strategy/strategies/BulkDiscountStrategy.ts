import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class BulkDiscountStrategy implements DiscountStrategy {
  readonly id = 'bulk';

  calculate(context: DiscountContext): number {
    const qty = context.lines.reduce((sum, line) => sum + line.getQuantity(), 0);
    if (qty < 5) return 0;
    return context.subtotal * 0.15;
  }

  getLabel(): string {
    return 'Bulk (5+ items): 15%';
  }
}
