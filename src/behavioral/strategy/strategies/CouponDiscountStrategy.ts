import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class CouponDiscountStrategy implements DiscountStrategy {
  readonly id = 'coupon';

  calculate(context: DiscountContext): number {
    if (!context.couponCode) return 0;

    if (context.couponCode === 'SUMMER10') return 10;
    if (context.couponCode === 'FOOD-FLAT') return 5;
    if (context.couponCode === 'BOOKS5') {
      const bookTotal = context.lines
        .filter((line) => line.getProduct().category === 'books')
        .reduce((sum, line) => sum + line.getLineTotal(), 0);
      return bookTotal * 0.05;
    }
    return 0;
  }

  getLabel(): string {
    return 'Coupon applied';
  }
}
