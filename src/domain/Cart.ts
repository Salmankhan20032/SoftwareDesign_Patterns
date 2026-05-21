import type { ProductFactory } from '../creational/ProductFactory';
import type { CartLineFactory } from '../creational/CartLineFactory';
import type { Product } from './Product';

export interface CartLine {
  product: Product;
  quantity: number;
}

export type CustomerTier = 'standard' | 'silver' | 'gold';

/**
 * Cart stores lines and applies discounts.
 * Phase 1: product/line creation delegated to factories (no primitive addItem).
 */
export class Cart {
  lines: CartLine[] = [];
  customerTier: CustomerTier = 'standard';
  isStudent = false;
  couponCode: string | null = null;

  private readonly productFactory: ProductFactory;
  private readonly lineFactory: CartLineFactory;

  constructor(productFactory: ProductFactory, lineFactory: CartLineFactory) {
    this.productFactory = productFactory;
    this.lineFactory = lineFactory;
  }

  addFromCatalog(productId: string, quantity = 1): boolean {
    const product = this.productFactory.createById(productId);
    if (!product) return false;

    const existing = this.lines.find((line) => line.product.id === productId);
    if (existing) {
      existing.quantity += quantity;
      return true;
    }

    this.lines.push(this.lineFactory.create(product, quantity));
    return true;
  }

  removeItem(productId: string): void {
    this.lines = this.lines.filter((line) => line.product.id !== productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    const line = this.lines.find((l) => l.product.id === productId);
    if (line) {
      line.quantity = Math.max(1, quantity);
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
    return this.lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  }

  /**
   * All discount logic is hardcoded here — new rules require editing this method.
   * (Addressed in Phase 3 with Strategy.)
   */
  calculateDiscount(): number {
    const subtotal = this.getSubtotal();
    let discount = 0;

    if (this.isStudent) {
      discount += subtotal * 0.1;
    }

    const totalQuantity = this.lines.reduce((sum, line) => sum + line.quantity, 0);
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
        .filter((line) => line.product.category === 'books')
        .reduce((sum, line) => sum + line.product.price * line.quantity, 0);
      discount += bookTotal * 0.05;
    } else if (this.couponCode === 'FOOD-FLAT') {
      discount += 5;
    }

    if (subtotal > 200 && this.lines.some((line) => line.product.category === 'electronics')) {
      discount += 25;
    }

    return Math.min(discount, subtotal);
  }

  getTotal(): number {
    return this.getSubtotal() - this.calculateDiscount();
  }

  getDiscountBreakdown(): string[] {
    const notes: string[] = [];
    if (this.isStudent) notes.push('Student: 10%');
    const totalQuantity = this.lines.reduce((sum, line) => sum + line.quantity, 0);
    if (totalQuantity >= 5) notes.push('Bulk (5+ items): 15%');
    if (this.customerTier === 'gold') notes.push('Gold loyalty: 20%');
    else if (this.customerTier === 'silver') notes.push('Silver loyalty: 5%');
    if (this.couponCode) notes.push(`Coupon: ${this.couponCode}`);
    if (this.getSubtotal() > 200) notes.push('Electronics over $200: $25 off');
    return notes;
  }

  clear(): void {
    this.lines = [];
    this.couponCode = null;
    this.isStudent = false;
    this.customerTier = 'standard';
  }
}
