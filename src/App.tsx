import { useMemo, useState } from 'react';
import { CartBuilder } from './creational/CartBuilder';
import type { CustomerTier } from './domain/Cart';
import { CATALOG } from './data/catalog';
import './App.css';

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default function App() {
  const [cart] = useState(() => new CartBuilder().withCatalog(CATALOG).build());
  const [, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const subtotal = useMemo(() => cart.getSubtotal(), [cart, cart.lines]);
  const discount = useMemo(
    () => cart.calculateDiscount(),
    [cart, cart.lines, cart.isStudent, cart.customerTier, cart.couponCode],
  );
  const total = useMemo(() => cart.getTotal(), [cart, discount, subtotal]);

  const addToCart = (productId: string) => {
    cart.addFromCatalog(productId, 1);
    refresh();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>E-Commerce Cart</h1>
        <p className="subtitle">Phase 1 — Factory Method + Builder (discounts still in Cart)</p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Catalog</h2>
          <ul className="catalog">
            {CATALOG.map((product) => (
              <li key={product.id} className="catalog-item">
                <div>
                  <strong>{product.name}</strong>
                  <span className="muted">{product.category}</span>
                </div>
                <div className="row">
                  <span>{formatMoney(product.price)}</span>
                  <button type="button" onClick={() => addToCart(product.id)}>
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Your Cart</h2>

          {cart.lines.length === 0 ? (
            <p className="empty">Cart is empty. Add products from the catalog.</p>
          ) : (
            <ul className="cart-lines">
              {cart.lines.map((line) => (
                <li key={line.product.id} className="cart-line">
                  <span>
                    {line.product.name} × {line.quantity}
                  </span>
                  <div className="row">
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => {
                        cart.updateQuantity(line.product.id, Number(e.target.value));
                        refresh();
                      }}
                    />
                    <button
                      type="button"
                      className="danger"
                      onClick={() => {
                        cart.removeItem(line.product.id);
                        refresh();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="controls">
            <label>
              <input
                type="checkbox"
                checked={cart.isStudent}
                onChange={(e) => {
                  cart.setStudentDiscount(e.target.checked);
                  refresh();
                }}
              />
              Student discount
            </label>

            <label>
              Loyalty tier
              <select
                value={cart.customerTier}
                onChange={(e) => {
                  cart.setCustomerTier(e.target.value as CustomerTier);
                  refresh();
                }}
              >
                <option value="standard">Standard</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </label>

            <label>
              Coupon code
              <select
                value={cart.couponCode ?? ''}
                onChange={(e) => {
                  const code = e.target.value;
                  if (code) cart.applyCoupon(code);
                  else cart.couponCode = null;
                  refresh();
                }}
              >
                <option value="">None</option>
                <option value="SUMMER10">SUMMER10</option>
                <option value="BOOKS5">BOOKS5 (books only)</option>
                <option value="FOOD-FLAT">FOOD-FLAT</option>
              </select>
            </label>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                cart.clear();
                refresh();
              }}
            >
              Clear cart
            </button>
          </div>

          <footer className="totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="total-row discount">
              <span>Discount</span>
              <span>−{formatMoney(discount)}</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            {cart.getDiscountBreakdown().length > 0 && (
              <ul className="breakdown">
                {cart.getDiscountBreakdown().map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}
