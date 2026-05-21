import { LineDecorator } from './LineDecorator';

const GIFT_WRAP_FEE = 4.99;
const LABEL = 'Gift wrap';

export class GiftWrapDecorator extends LineDecorator {
  getAddOnLabels(): string[] {
    return [...this.wrappee.getAddOnLabels(), LABEL];
  }

  getUnitTotal(): number {
    if (this.wrappee.getAddOnLabels().includes(LABEL)) {
      return this.wrappee.getUnitTotal();
    }
    return this.wrappee.getUnitTotal() + GIFT_WRAP_FEE;
  }
}
