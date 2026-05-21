import type { Product } from '../domain/Product';
import { BasePricedLine } from '../structural/decorator/BasePricedLine';
import type { PricedLine } from '../structural/decorator/PricedLine';

/**
 * Factory Method — centralizes cart line assembly (product + quantity).
 */
export class CartLineFactory {
  create(product: Product, quantity: number): PricedLine {
    return new BasePricedLine(product, quantity);
  }
}
