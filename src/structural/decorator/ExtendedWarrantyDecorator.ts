import { LineDecorator } from './LineDecorator';

const LABEL = 'Extended warranty';

export class ExtendedWarrantyDecorator extends LineDecorator {
  getAddOnLabels(): string[] {
    return [...this.wrappee.getAddOnLabels(), LABEL];
  }

  getUnitTotal(): number {
    if (this.wrappee.getAddOnLabels().includes(LABEL)) {
      return this.wrappee.getUnitTotal();
    }
    const baseProductPrice = this.wrappee.getProduct().price;
    return this.wrappee.getUnitTotal() + baseProductPrice * 0.15;
  }
}
