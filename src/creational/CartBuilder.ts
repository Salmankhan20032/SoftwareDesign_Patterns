import { Cart } from '../domain/Cart';
import type { CustomerTier } from '../domain/Cart';
import type { Product } from '../domain/Product';
import { CartLineFactory } from './CartLineFactory';
import { CatalogProductFactory } from './CatalogProductFactory';
import type { ProductFactory } from './ProductFactory';

/**
 * Builder — step-by-step cart setup without a telescoping constructor.
 */
export class CartBuilder {
  private catalog: readonly Product[] = [];
  private tier: CustomerTier = 'standard';
  private student = false;
  private productFactory?: ProductFactory;

  withCatalog(catalog: readonly Product[]): this {
    this.catalog = catalog;
    return this;
  }

  withProductFactory(factory: ProductFactory): this {
    this.productFactory = factory;
    return this;
  }

  asStudent(): this {
    this.student = true;
    return this;
  }

  withLoyaltyTier(tier: CustomerTier): this {
    this.tier = tier;
    return this;
  }

  build(): Cart {
    const factory = this.productFactory ?? new CatalogProductFactory(this.catalog);
    const cart = new Cart(factory, new CartLineFactory());
    cart.setStudentDiscount(this.student);
    cart.setCustomerTier(this.tier);
    return cart;
  }
}
