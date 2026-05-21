import type { RefObject } from 'react';
import {
  Gift,
  Loader2,
  Percent,
  Shield,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Users,
} from 'lucide-react';
import type { Cart, CustomerTier, LineAddOn } from '../domain/Cart';
import type { ExternalPromotion } from '../structural/adapter/PromotionProvider';
import { formatMoney } from '../utils/format';

interface CartPanelProps {
  cartPanelRef?: RefObject<HTMLElement | null>;
  cart: Cart;
  subtotal: number;
  discount: number;
  total: number;
  loadingPromos: boolean;
  onStudentChange: (enabled: boolean) => void;
  onLoadPartnerPromos: () => void;
  onToggleAddOn: (productId: string, addOn: LineAddOn) => void;
  onCheckout: () => void;
}

export function CartPanel({
  cartPanelRef,
  cart,
  subtotal,
  discount,
  total,
  loadingPromos,
  onStudentChange,
  onLoadPartnerPromos,
  onToggleAddOn,
  onCheckout,
}: CartPanelProps) {
  const itemCount = cart.lines.reduce((n, l) => n + l.getQuantity(), 0);

  return (
    <aside id="shopping-cart" className="cart-panel" ref={cartPanelRef}>
      <div className="cart-panel-inner">
        <div className="cart-panel-header">
          <Truck size={20} className="text-orange" />
          <h2>Shopping Cart</h2>
          <span className="cart-item-count">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cart.lines.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <Truck size={40} strokeWidth={1.25} />
            </div>
            <p>Your cart is empty</p>
            <span>Add items from the store to get started</span>
          </div>
        ) : (
          <ul className="cart-items">
            {cart.lines.map((line) => (
              <li key={line.productId} className="cart-item">
                <div className="cart-item-main">
                  <div>
                    <h4>{line.getName()}</h4>
                    <p className="cart-item-qty">Qty: {line.getQuantity()}</p>
                    {line.getAddOnLabels().length > 0 && (
                      <div className="cart-item-tags">
                        {line.getAddOnLabels().map((label) => (
                          <span key={label} className="tag">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <strong className="cart-item-price">${formatMoney(line.getLineTotal())}</strong>
                </div>
                <div className="cart-item-actions">
                  <label className="chip-toggle">
                    <input
                      type="checkbox"
                      checked={line.getAddOnLabels().includes('Gift wrap')}
                      onChange={() => onToggleAddOn(line.productId, 'gift-wrap')}
                    />
                    <Gift size={14} />
                    Gift wrap
                  </label>
                  <label className="chip-toggle">
                    <input
                      type="checkbox"
                      checked={line.getAddOnLabels().includes('Extended warranty')}
                      onChange={() => onToggleAddOn(line.productId, 'warranty')}
                    />
                    <Shield size={14} />
                    Warranty
                  </label>
                  <div className="qty-control">
                    <label htmlFor={`qty-${line.productId}`}>Qty</label>
                    <input
                      id={`qty-${line.productId}`}
                      type="number"
                      min={1}
                      value={line.getQuantity()}
                      onChange={(e) => cart.updateQuantity(line.productId, Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-icon-danger"
                    onClick={() => cart.removeItem(line.productId)}
                    aria-label={`Remove ${line.getName()}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="promo-section">
          <h3>
            <Percent size={16} />
            Savings &amp; offers
          </h3>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={cart.isStudent}
              onChange={(e) => onStudentChange(e.target.checked)}
            />
            <Users size={16} />
            <span>Student discount (10%)</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={cart.blackFridayEnabled}
              onChange={(e) => (e.target.checked ? cart.enableBlackFriday() : cart.disableBlackFriday())}
            />
            <Sparkles size={16} />
            <span>Black Friday — clothing</span>
          </label>

          <label className="field-row">
            <Users size={16} />
            <span>Loyalty tier</span>
            <select
              value={cart.customerTier}
              onChange={(e) => cart.setCustomerTier(e.target.value as CustomerTier)}
            >
              <option value="standard">Standard</option>
              <option value="silver">Silver (5%)</option>
              <option value="gold">Gold (20%)</option>
            </select>
          </label>

          <label className="field-row">
            <Tag size={16} />
            <span>Coupon</span>
            <select
              value={cart.couponCode ?? ''}
              onChange={(e) => {
                const code = e.target.value;
                if (code) cart.applyCoupon(code);
                else cart.clearCoupon();
              }}
            >
              <option value="">None</option>
              <option value="SUMMER10">SUMMER10 — $10 off</option>
              <option value="BOOKS5">BOOKS5 — 5% books</option>
              <option value="FOOD-FLAT">FOOD-FLAT — $5 off</option>
            </select>
          </label>

          <button
            type="button"
            className="btn-outline"
            onClick={onLoadPartnerPromos}
            disabled={loadingPromos}
          >
            {loadingPromos ? (
              <>
                <Loader2 size={16} className="spin" />
                Loading…
              </>
            ) : (
              <>
                <Tag size={16} />
                Load partner promos
              </>
            )}
          </button>

          {cart.externalPromotions.length > 0 && (
            <label className="field-row">
              <Tag size={16} />
              <span>Partner</span>
              <select
                value={cart.activeExternalPromo ?? ''}
                onChange={(e) => {
                  const code = e.target.value;
                  if (code) cart.applyExternalPromo(code);
                  else cart.clearExternalPromo();
                }}
              >
                <option value="">None</option>
                {cart.externalPromotions.map((promo: ExternalPromotion) => (
                  <option key={promo.code} value={promo.code}>
                    {promo.code}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        <section className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row savings">
              <span>Your savings</span>
              <span>−${formatMoney(discount)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Order total</span>
            <span>${formatMoney(total)}</span>
          </div>
          {cart.getDiscountBreakdown().length > 0 && (
            <ul className="savings-list">
              {cart.getDiscountBreakdown().map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="btn-checkout"
            disabled={cart.lines.length === 0}
            onClick={onCheckout}
          >
            Proceed to checkout
          </button>
          <button type="button" className="btn-clear" onClick={() => cart.clear()}>
            Clear cart
          </button>
        </section>
      </div>
    </aside>
  );
}
