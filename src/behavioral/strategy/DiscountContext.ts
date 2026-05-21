import type { CustomerTier } from '../../domain/Cart';
import type { ExternalPromotion } from '../../structural/adapter/PromotionProvider';
import type { PricedLine } from '../../structural/decorator/PricedLine';

export interface DiscountContext {
  lines: PricedLine[];
  subtotal: number;
  isStudent: boolean;
  customerTier: CustomerTier;
  couponCode: string | null;
  externalPromotions: ExternalPromotion[];
  activeExternalPromo: string | null;
}
