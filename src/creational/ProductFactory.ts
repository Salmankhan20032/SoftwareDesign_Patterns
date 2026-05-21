import type { Product } from '../domain/Product';

/**
 * Factory Method — creator declares factory; subclasses decide which product to build.
 */
export interface ProductFactory {
  createById(id: string): Product | undefined;
}
