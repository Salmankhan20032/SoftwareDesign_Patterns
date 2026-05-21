import { DiscountEngine } from './DiscountEngine';
import { BulkDiscountStrategy } from './strategies/BulkDiscountStrategy';
import { CouponDiscountStrategy } from './strategies/CouponDiscountStrategy';
import { ElectronicsPromoStrategy } from './strategies/ElectronicsPromoStrategy';
import { ExternalPromoStrategy } from './strategies/ExternalPromoStrategy';
import { LoyaltyDiscountStrategy } from './strategies/LoyaltyDiscountStrategy';
import { StudentDiscountStrategy } from './strategies/StudentDiscountStrategy';

export function createDefaultDiscountEngine(): DiscountEngine {
  return new DiscountEngine([
    new StudentDiscountStrategy(),
    new BulkDiscountStrategy(),
    new LoyaltyDiscountStrategy(),
    new CouponDiscountStrategy(),
    new ElectronicsPromoStrategy(),
    new ExternalPromoStrategy(),
  ]);
}
