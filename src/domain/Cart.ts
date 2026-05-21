import type { ProductFactory } from '../creational/ProductFactory';
import type { CartLineFactory } from '../creational/CartLineFactory';
import type { ExternalPromotion, PromotionProvider } from '../structural/adapter/PromotionProvider';
import { ExtendedWarrantyDecorator } from '../structural/decorator/ExtendedWarrantyDecorator';
import { GiftWrapDecorator } from '../structural/decorator/GiftWrapDecorator';
import type { PricedLine } from '../structural/decorator/PricedLine';
import { BasePricedLine } from '../structural/decorator/BasePricedLine';
import type { Product } from './Product';

export type CustomerTier = 'standard' | 'silver' | 'gold';
export type LineAddOn = 'gift-wrap' | 'warranty';

/**
 * Cart stores priced lines, applies discounts, and optional external promos (Phase 2).
 */
export class Cart {
  lines: PricedLine[] = [];
  customerTier: CustomerTier = 'standard';
  isStudent = false;
  couponCode: string | null = null;
  externalPromotions: ExternalPromotion[] = [];
  activeExternalPromo: string | null = null;

  private readonly productFactory: ProductFactory;
  private readonly lineFactory: CartLineFactory;

  constructor(productFactory: ProductFactory, lineFactory: CartLineFactory) {
    this.productFactory = productFactory;
    this.lineFactory = lineFactory;
  }

  addFromCatalog(productId: string, quantity = 1): boolean {
    const product = this.productFactory.createById(productId);
    if (!product) return false;

    const existing = this.lines.find((line) => line.productId === productId);
    if (existing && existing instanceof BasePricedLine) {
      existing.setQuantity(existing.getQuantity() + quantity);
      return true;
    }
    if (existing) {
      const baseQty = existing.getQuantity() + quantity;
      this.lines = this.lines.filter((l) => l.productId !== productId);
      this.lines.push(this.lineFactory.create(product, baseQty));
      return true;
    }

    this.lines.push(this.lineFactory.create(product, quantity));
    return true;
  }

  addAddOn(productId: string, addOn: LineAddOn): void {
    const index = this.lines.findIndex((line) => line.productId === productId);
    if (index === -1) return;

    let line = this.lines[index];
    if (addOn === 'gift-wrap' && !line.getAddOnLabels().includes('Gift wrap')) {
      line = new GiftWrapDecorator(line);
    }
    if (addOn === 'warranty' && !line.getAddOnLabels().includes('Extended warranty')) {
      line = new ExtendedWarrantyDecorator(line);
    }
    this.lines[index] = line;
  }

  async loadExternalPromotions(provider: PromotionProvider): Promise<ExternalPromotion[]> {
    this.externalPromotions = await provider.loadPromotions();
    return this.externalPromotions;
  }

  applyExternalPromo(code: string): void {
    const normalized = code.toUpperCase();
    const found = this.externalPromotions.some((p) => p.code === normalized);
    this.activeExternalPromo = found ? normalized : null;
  }

  removeItem(productId: string): void {
    this.lines = this.lines.filter((line) => line.productId !== productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    const line = this.lines.find((l) => l.productId === productId);
    if (line instanceof BasePricedLine) {
      line.setQuantity(quantity);
    }
  }

  setStudentDiscount(enabled: boolean): void {
    this.isStudent = enabled;
  }

  setCustomerTier(tier: CustomerTier): void {
    this.customerTier = tier;
  }

  applyCoupon(code: string): void {
    this.couponCode = code.toUpperCase();
  }

  getSubtotal(): number {
    return this.lines.reduce((sum, line) => sum + line.getLineTotal(), 0);
  }

  calculateExternalPromoDiscount(): number {
    if (!this.activeExternalPromo) return 0;
    const promo = this.externalPromotions.find((p) => p.code === this.activeExternalPromo);
    if (!promo) return 0;

    const subtotal = this.getSubtotal();
    let discount = 0;

    if (promo.percentOff) {
      if (promo.categories?.length) {
        const eligible = this.lines
          .filter((line) => promo.categories!.includes(line.getProduct().category))
          .reduce((sum, line) => sum + line.getLineTotal(), 0);
        discount += eligible * (promo.percentOff / 100);
      } else {
        discount += subtotal * (promo.percentOff / 100);
      }
    }

    if (promo.flatOff) {
      discount += promo.flatOff;
    }

    return Math.min(discount, subtotal);
  }

  /**
   * Discount logic still hardcoded — Strategy in Phase 3.
   */
  calculateDiscount(): number {
    const subtotal = this.getSubtotal();
    let discount = 0;

    if (this.isStudent) {
      discount += subtotal * 0.1;
    }

    const totalQuantity = this.lines.reduce((sum, line) => sum + line.getQuantity(), 0);
    if (totalQuantity >= 5) {
      discount += subtotal * 0.15;
    }

    if (this.customerTier === 'gold') {
      discount += subtotal * 0.2;
    } else if (this.customerTier === 'silver') {
      discount += subtotal * 0.05;
    }

    if (this.couponCode === 'SUMMER10') {
      discount += 10;
    } else if (this.couponCode === 'BOOKS5') {
      const bookTotal = this.lines
        .filter((line) => line.getProduct().category === 'books')
        .reduce((sum, line) => sum + line.getLineTotal(), 0);
      discount += bookTotal * 0.05;
    } else if (this.couponCode === 'FOOD-FLAT') {
      discount += 5;
    }

    if (subtotal > 200 && this.lines.some((line) => line.getProduct().category === 'electronics')) {
      discount += 25;
    }

    discount += this.calculateExternalPromoDiscount();
    return Math.min(discount, subtotal);
  }

  getTotal(): number {
    return this.getSubtotal() - this.calculateDiscount();
  }

  getDiscountBreakdown(): string[] {
    const notes: string[] = [];
    if (this.isStudent) notes.push('Student: 10%');
    const totalQuantity = this.lines.reduce((sum, line) => sum + line.getQuantity(), 0);
    if (totalQuantity >= 5) notes.push('Bulk (5+ items): 15%');
    if (this.customerTier === 'gold') notes.push('Gold loyalty: 20%');
    else if (this.customerTier === 'silver') notes.push('Silver loyalty: 5%');
    if (this.couponCode) notes.push(`Coupon: ${this.couponCode}`);
    if (this.getSubtotal() > 200) notes.push('Electronics over $200: $25 off');
    if (this.activeExternalPromo) notes.push(`Partner promo: ${this.activeExternalPromo}`);
    return notes;
  }

  clear(): void {
    this.lines = [];
    this.couponCode = null;
    this.isStudent = false;
    this.customerTier = 'standard';
    this.externalPromotions = [];
    this.activeExternalPromo = null;
  }
}

// Re-export for components that need Product type on lines
export type { Product };
