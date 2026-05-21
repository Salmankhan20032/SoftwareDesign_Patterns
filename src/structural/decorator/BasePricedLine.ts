import type { Product } from '../../domain/Product';
import type { PricedLine } from './PricedLine';

/** Concrete component — base product line without add-ons. */
export class BasePricedLine implements PricedLine {
  readonly productId: string;
  private readonly product: Product;
  private quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.productId = product.id;
    this.quantity = Math.max(1, quantity);
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(qty: number): void {
    this.quantity = Math.max(1, qty);
  }

  getName(): string {
    return this.product.name;
  }

  getAddOnLabels(): string[] {
    return [];
  }

  getUnitTotal(): number {
    return this.product.price;
  }

  getLineTotal(): number {
    return this.product.price * this.quantity;
  }
}
