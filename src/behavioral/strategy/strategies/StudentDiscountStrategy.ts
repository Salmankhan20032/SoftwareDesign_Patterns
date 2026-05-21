import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class StudentDiscountStrategy implements DiscountStrategy {
  readonly id = 'student';

  calculate(context: DiscountContext): number {
    if (!context.isStudent) return 0;
    return context.subtotal * 0.1;
  }

  getLabel(): string {
    return 'Student: 10%';
  }
}
