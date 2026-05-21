import type { Product } from '../domain/Product';
import type { ProductFactory } from './ProductFactory';

/**
 * Concrete factory: builds Product instances from the in-memory catalog.
 * Returns a shallow copy so cart mutations never alter catalog templates.
 */
export class CatalogProductFactory implements ProductFactory {
  private readonly catalog: readonly Product[];

  constructor(catalog: readonly Product[]) {
    this.catalog = catalog;
  }

  createById(id: string): Product | undefined {
    const template = this.catalog.find((p) => p.id === id);
    if (!template) return undefined;
    return { ...template };
  }
}
