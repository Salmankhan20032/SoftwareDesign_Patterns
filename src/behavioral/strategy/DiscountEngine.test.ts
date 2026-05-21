import { describe, expect, it } from 'vitest';
import type { DiscountContext } from './DiscountContext';
import { DiscountEngine } from './DiscountEngine';
import { BlackFridayDiscountStrategy } from './strategies/BlackFridayDiscountStrategy';
import { BulkDiscountStrategy } from './strategies/BulkDiscountStrategy';
import { StudentDiscountStrategy } from './strategies/StudentDiscountStrategy';
import type { Product } from '../../domain/Product';
import { BasePricedLine } from '../../structural/decorator/BasePricedLine';

function product(id: string, price: number, category: Product['category'] = 'books'): Product {
  return { id, name: id, price, category };
}

function context(partial: Partial<DiscountContext> & { subtotal?: number }): DiscountContext {
  const lines = partial.lines ?? [new BasePricedLine(product('p1', 100), 1)];
  return {
    lines,
    subtotal: partial.subtotal ?? 100,
    isStudent: partial.isStudent ?? false,
    customerTier: partial.customerTier ?? 'standard',
    couponCode: partial.couponCode ?? null,
    externalPromotions: partial.externalPromotions ?? [],
    activeExternalPromo: partial.activeExternalPromo ?? null,
  };
}

describe('DiscountEngine', () => {
  it('applies student strategy', () => {
    const engine = new DiscountEngine([new StudentDiscountStrategy()]);
    const result = engine.calculate(context({ isStudent: true, subtotal: 200 }));
    expect(result.amount).toBe(20);
    expect(result.breakdown).toContain('Student: 10%');
  });

  it('applies bulk strategy for 5+ items', () => {
    const lines = Array.from({ length: 5 }, (_, i) =>
      new BasePricedLine(product(`p${i}`, 20), 1),
    );
    const engine = new DiscountEngine([new BulkDiscountStrategy()]);
    const result = engine.calculate(context({ lines, subtotal: 100 }));
    expect(result.amount).toBe(15);
  });

  it('supports OCP — add BlackFriday without editing engine class', () => {
    const engine = new DiscountEngine([new StudentDiscountStrategy()]);
    engine.addStrategy(new BlackFridayDiscountStrategy());
    const lines = [new BasePricedLine(product('shirt', 50, 'clothing'), 2)];
    const result = engine.calculate(context({ lines, subtotal: 100 }));
    expect(result.amount).toBe(12);
    expect(result.breakdown.some((b) => b.includes('Black Friday'))).toBe(true);
  });

  it('caps discount at subtotal', () => {
    const engine = new DiscountEngine([
      new StudentDiscountStrategy(),
      new BulkDiscountStrategy(),
    ]);
    const lines = Array.from({ length: 6 }, () => new BasePricedLine(product('x', 10), 1));
    const result = engine.calculate(context({ lines, subtotal: 60, isStudent: true }));
    expect(result.amount).toBeLessThanOrEqual(60);
  });
});
