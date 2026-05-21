import type { Product } from '../../domain/Product';

/**
 * Decorator — component interface for cart line pricing.
 */
export interface PricedLine {
  readonly productId: string;
  getProduct(): Product;
  getQuantity(): number;
  getName(): string;
  getAddOnLabels(): string[];
  /** Per-unit price including stacked decorators. */
  getUnitTotal(): number;
  getLineTotal(): number;
}
