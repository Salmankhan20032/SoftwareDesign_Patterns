import type { ProductFactory } from '../creational/ProductFactory';
import type { CartLineFactory } from '../creational/CartLineFactory';
import type { CartObserver } from '../behavioral/observer/CartObserver';
import type { DiscountContext } from '../behavioral/strategy/DiscountContext';
import type { DiscountEngine } from '../behavioral/strategy/DiscountEngine';
import { createDefaultDiscountEngine } from '../behavioral/strategy/createDefaultDiscountEngine';
import { BlackFridayDiscountStrategy } from '../behavioral/strategy/strategies/BlackFridayDiscountStrategy';
import type { ExternalPromotion, PromotionProvider } from '../structural/adapter/PromotionProvider';
import { ExtendedWarrantyDecorator } from '../structural/decorator/ExtendedWarrantyDecorator';
import { GiftWrapDecorator } from '../structural/decorator/GiftWrapDecorator';
import type { PricedLine } from '../structural/decorator/PricedLine';
import { BasePricedLine } from '../structural/decorator/BasePricedLine';
import type { Product } from './Product';

export type CustomerTier = 'standard' | 'silver' | 'gold';
export type LineAddOn = 'gift-wrap' | 'warranty';

/**
 * Cart — Phase 3: discounts via Strategy engine, mutations notify Observers.
 */
export class Cart {
  lines: PricedLine[] = [];
  customerTier: CustomerTier = 'standard';
  isStudent = false;
  couponCode: string | null = null;
  externalPromotions: ExternalPromotion[] = [];
  activeExternalPromo: string | null = null;
  blackFridayEnabled = false;

  private readonly productFactory: ProductFactory;
  private readonly lineFactory: CartLineFactory;
  private readonly discountEngine: DiscountEngine;
  private readonly observers: CartObserver[] = [];
  private lastDiscountBreakdown: string[] = [];

  constructor(
    productFactory: ProductFactory,
    lineFactory: CartLineFactory,
    discountEngine?: DiscountEngine,
  ) {
    this.productFactory = productFactory;
    this.lineFactory = lineFactory;
    this.discountEngine = discountEngine ?? createDefaultDiscountEngine();
  }

  subscribe(observer: CartObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: CartObserver): void {
    const index = this.observers.indexOf(observer);
    if (index >= 0) this.observers.splice(index, 1);
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer.onCartChanged(this);
    }
  }

  private touch(): void {
    this.notify();
  }

  addFromCatalog(productId: string, quantity = 1): boolean {
    const product = this.productFactory.createById(productId);
    if (!product) return false;

    const existing = this.lines.find((line) => line.productId === productId);
    if (existing && existing instanceof BasePricedLine) {
      existing.setQuantity(existing.getQuantity() + quantity);
      this.touch();
      return true;
    }
    if (existing) {
      const baseQty = existing.getQuantity() + quantity;
      this.lines = this.lines.filter((l) => l.productId !== productId);
      this.lines.push(this.lineFactory.create(product, baseQty));
      this.touch();
      return true;
    }

    this.lines.push(this.lineFactory.create(product, quantity));
    this.touch();
    return true;
  }

  toggleAddOn(productId: string, addOn: LineAddOn): void {
    const index = this.lines.findIndex((line) => line.productId === productId);
    if (index === -1) return;

    const line = this.lines[index];
    const labels = line.getAddOnLabels();
    const hasGift = labels.includes('Gift wrap');
    const hasWarranty = labels.includes('Extended warranty');

    let wantGift = hasGift;
    let wantWarranty = hasWarranty;
    if (addOn === 'gift-wrap') wantGift = !hasGift;
    if (addOn === 'warranty') wantWarranty = !hasWarranty;

    this.lines[index] = this.buildLineWithAddOns(line.getProduct(), line.getQuantity(), wantGift, wantWarranty);
    this.touch();
  }

  private buildLineWithAddOns(
    product: Product,
    quantity: number,
    giftWrap: boolean,
    warranty: boolean,
  ): PricedLine {
    let line: PricedLine = new BasePricedLine(product, quantity);
    if (giftWrap) line = new GiftWrapDecorator(line);
    if (warranty) line = new ExtendedWarrantyDecorator(line);
    return line;
  }

  async loadExternalPromotions(provider: PromotionProvider): Promise<ExternalPromotion[]> {
    this.externalPromotions = await provider.loadPromotions();
    this.touch();
    return this.externalPromotions;
  }

  applyExternalPromo(code: string): void {
    const normalized = code.toUpperCase();
    const found = this.externalPromotions.some((p) => p.code === normalized);
    this.activeExternalPromo = found ? normalized : null;
    this.touch();
  }

  enableBlackFriday(): void {
    if (this.blackFridayEnabled) return;
    this.discountEngine.addStrategy(new BlackFridayDiscountStrategy());
    this.blackFridayEnabled = true;
    this.touch();
  }

  disableBlackFriday(): void {
    if (!this.blackFridayEnabled) return;
    this.discountEngine.removeStrategy('black-friday');
    this.blackFridayEnabled = false;
    this.touch();
  }

  removeItem(productId: string): void {
    this.lines = this.lines.filter((line) => line.productId !== productId);
    this.touch();
  }

  updateQuantity(productId: string, quantity: number): void {
    const index = this.lines.findIndex((l) => l.productId === productId);
    if (index === -1) return;
    const line = this.lines[index];
    const labels = line.getAddOnLabels();
    this.lines[index] = this.buildLineWithAddOns(
      line.getProduct(),
      quantity,
      labels.includes('Gift wrap'),
      labels.includes('Extended warranty'),
    );
    this.touch();
  }

  setStudentDiscount(enabled: boolean): void {
    this.isStudent = enabled;
    this.touch();
  }

  setCustomerTier(tier: CustomerTier): void {
    this.customerTier = tier;
    this.touch();
  }

  applyCoupon(code: string): void {
    this.couponCode = code.toUpperCase();
    this.touch();
  }

  clearCoupon(): void {
    this.couponCode = null;
    this.touch();
  }

  clearExternalPromo(): void {
    this.activeExternalPromo = null;
    this.touch();
  }

  getSubtotal(): number {
    return this.lines.reduce((sum, line) => sum + line.getLineTotal(), 0);
  }

  private buildDiscountContext(): DiscountContext {
    return {
      lines: this.lines,
      subtotal: this.getSubtotal(),
      isStudent: this.isStudent,
      customerTier: this.customerTier,
      couponCode: this.couponCode,
      externalPromotions: this.externalPromotions,
      activeExternalPromo: this.activeExternalPromo,
    };
  }

  calculateDiscount(): number {
    const result = this.discountEngine.calculate(this.buildDiscountContext());
    this.lastDiscountBreakdown = result.breakdown;
    return result.amount;
  }

  getTotal(): number {
    return this.getSubtotal() - this.calculateDiscount();
  }

  getDiscountBreakdown(): string[] {
    if (this.lastDiscountBreakdown.length === 0) {
      this.calculateDiscount();
    }
    return [...this.lastDiscountBreakdown];
  }

  clear(): void {
    this.lines = [];
    this.couponCode = null;
    this.isStudent = false;
    this.customerTier = 'standard';
    this.externalPromotions = [];
    this.activeExternalPromo = null;
    this.lastDiscountBreakdown = [];
    if (this.blackFridayEnabled) {
      this.disableBlackFriday();
    }
    this.touch();
  }
}

export type { Product };
