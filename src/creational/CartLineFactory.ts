import type { CartLine } from '../domain/Cart';
import type { Product } from '../domain/Product';

/**
 * Factory Method — centralizes cart line assembly (product + quantity).
 */
export class CartLineFactory {
  create(product: Product, quantity: number): CartLine {
    return {
      product,
      quantity: Math.max(1, quantity),
    };
  }
}
