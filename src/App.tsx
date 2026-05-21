import { useMemo, useState } from 'react';
import { CommandInvoker } from './behavioral/command/CommandInvoker';
import { AddItemCommand } from './behavioral/command/commands/AddItemCommand';
import { SetStudentDiscountCommand } from './behavioral/command/commands/SetStudentDiscountCommand';
import { CartPanel } from './components/CartPanel';
import { ProductCard } from './components/ProductCard';
import { StoreHeader } from './components/StoreHeader';
import { CartBuilder } from './creational/CartBuilder';
import { CATALOG } from './data/catalog';
import { useCartObserver } from './hooks/useCartObserver';
import { LegacyPromoAdapter } from './structural/adapter/LegacyPromoAdapter';
import { formatMoney } from './utils/format';
import './App.css';

export default function App() {
  const [cart] = useState(() => new CartBuilder().withCatalog(CATALOG).build());
  const [invoker] = useState(() => new CommandInvoker());
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [undoHint, setUndoHint] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useCartObserver(cart);

  const cartCount = useMemo(
    () => cart.lines.reduce((n, line) => n + line.getQuantity(), 0),
    [cart, cart.lines],
  );

  const subtotal = useMemo(() => cart.getSubtotal(), [cart, cart.lines]);
  const discount = useMemo(
    () => cart.calculateDiscount(),
    [
      cart,
      cart.lines,
      cart.isStudent,
      cart.customerTier,
      cart.couponCode,
      cart.activeExternalPromo,
      cart.externalPromotions,
      cart.blackFridayEnabled,
    ],
  );
  const total = useMemo(() => cart.getTotal(), [cart, discount, subtotal]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const runCommand = (command: Parameters<CommandInvoker['execute']>[0]) => {
    invoker.execute(command);
    setUndoHint(invoker.peekUndoLabel());
  };

  const addToCart = (productId: string) => {
    const product = CATALOG.find((p) => p.id === productId);
    runCommand(new AddItemCommand(cart, productId, 1, product?.name));
  };

  const loadPartnerPromos = async () => {
    setLoadingPromos(true);
    const adapter = new LegacyPromoAdapter();
    await cart.loadExternalPromotions(adapter);
    setLoadingPromos(false);
  };

  const handleUndo = () => {
    if (invoker.undo()) {
      setUndoHint(invoker.peekUndoLabel());
    } else {
      setUndoHint(null);
    }
  };

  return (
    <div className="store">
      <StoreHeader
        cartCount={cartCount}
        cartTotal={cartCount > 0 ? `$${formatMoney(total)}` : '$0.00'}
        canUndo={invoker.canUndo()}
        undoLabel={undoHint}
        onUndo={handleUndo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="store-main">
        <section className="catalog-section">
          <div className="catalog-hero">
            <h1>Shop deals in every category</h1>
            <p>Minimal storefront · Design patterns coursework demo</p>
          </div>

          {filteredCatalog.length === 0 ? (
            <p className="no-results">No products match your search.</p>
          ) : (
            <div className="product-grid">
              {filteredCatalog.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>

        <CartPanel
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
          loadingPromos={loadingPromos}
          onStudentChange={(enabled) =>
            runCommand(new SetStudentDiscountCommand(cart, enabled))
          }
          onLoadPartnerPromos={loadPartnerPromos}
          onToggleAddOn={(id, addOn) => cart.addAddOn(id, addOn)}
        />
      </main>

      <footer className="store-footer">
        <p>© 2026 ShopCart · Software Design Patterns — Topic D</p>
      </footer>
    </div>
  );
}
