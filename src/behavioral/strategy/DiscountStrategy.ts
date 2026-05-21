import type { DiscountContext } from './DiscountContext';

/**
 * Strategy — interchangeable discount algorithms (Open/Closed).
 */
export interface DiscountStrategy {
  readonly id: string;
  calculate(context: DiscountContext): number;
  getLabel(): string;
}
