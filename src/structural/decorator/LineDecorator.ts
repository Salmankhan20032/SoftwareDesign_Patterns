import type { Product } from '../../domain/Product';
import type { PricedLine } from './PricedLine';

/** Decorator — base delegating wrapper. */
export abstract class LineDecorator implements PricedLine {
  readonly productId: string;
  protected readonly wrappee: PricedLine;

  constructor(wrappee: PricedLine) {
    this.wrappee = wrappee;
    this.productId = wrappee.productId;
  }

  getProduct(): Product {
    return this.wrappee.getProduct();
  }

  getQuantity(): number {
    return this.wrappee.getQuantity();
  }

  getName(): string {
    return this.wrappee.getName();
  }

  abstract getAddOnLabels(): string[];
  abstract getUnitTotal(): number;

  getLineTotal(): number {
    return this.getUnitTotal() * this.getQuantity();
  }
}
