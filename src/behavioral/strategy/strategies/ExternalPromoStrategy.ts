import type { DiscountContext } from '../DiscountContext';
import type { DiscountStrategy } from '../DiscountStrategy';

export class ExternalPromoStrategy implements DiscountStrategy {
  readonly id = 'external-promo';

  calculate(context: DiscountContext): number {
    if (!context.activeExternalPromo) return 0;
    const promo = context.externalPromotions.find((p) => p.code === context.activeExternalPromo);
    if (!promo) return 0;

    let discount = 0;

    if (promo.percentOff) {
      if (promo.categories?.length) {
        const eligible = context.lines
          .filter((line) => promo.categories!.includes(line.getProduct().category))
          .reduce((sum, line) => sum + line.getLineTotal(), 0);
        discount += eligible * (promo.percentOff / 100);
      } else {
        discount += context.subtotal * (promo.percentOff / 100);
      }
    }

    if (promo.flatOff) {
      discount += promo.flatOff;
    }

    return discount;
  }

  getLabel(): string {
    return 'Partner promo';
  }
}
