import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CommandInvoker } from './behavioral/command/CommandInvoker';
import { AddItemCommand } from './behavioral/command/commands/AddItemCommand';
import { SetStudentDiscountCommand } from './behavioral/command/commands/SetStudentDiscountCommand';
import { CartPanel } from './components/CartPanel';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductCard } from './components/ProductCard';
import { StoreHeader, type SearchCategory } from './components/StoreHeader';
import { Toast, type ToastMessage } from './components/Toast';
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
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const cartPanelRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartVersion = useCartObserver(cart);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, text, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const cartCount = cart.lines.reduce((n, line) => n + line.getQuantity(), 0);
  const subtotal = cart.getSubtotal();
  const discount = cart.calculateDiscount();
  const total = cart.getTotal();
  const cartTotalDisplay = `$${formatMoney(cartCount > 0 ? total : 0)}`;

  // cartVersion forces re-render when cart mutates (useMemo was stale)
  void cartVersion;

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CATALOG.filter((p) => {
      const matchesCategory = searchCategory === 'all' || p.category === searchCategory;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, searchCategory]);

  const scrollToCart = () => {
    cartPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const runCommand = (command: Parameters<CommandInvoker['execute']>[0]) => {
    invoker.execute(command);
    setUndoHint(invoker.peekUndoLabel());
  };

  const addToCart = (productId: string) => {
    const product = CATALOG.find((p) => p.id === productId);
    runCommand(new AddItemCommand(cart, productId, 1, product?.name));
    showToast(`Added ${product?.name ?? 'item'} to cart`, 'success');
  };

  const loadPartnerPromos = async () => {
    setLoadingPromos(true);
    const adapter = new LegacyPromoAdapter();
    const promos = await cart.loadExternalPromotions(adapter);
    setLoadingPromos(false);
    showToast(`Loaded ${promos.length} partner promotions`, 'success');
  };

  const handleUndo = () => {
    if (invoker.undo()) {
      setUndoHint(invoker.peekUndoLabel());
      showToast('Undid last action', 'info');
    } else {
      setUndoHint(null);
    }
  };

  const handleCheckoutConfirm = () => {
    setCheckoutOpen(false);
    showToast(`Order placed! Total $${formatMoney(total)}`, 'success');
    cart.clear();
    setUndoHint(null);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div className="store">
      <StoreHeader
        cartCount={cartCount}
        cartTotal={cartTotalDisplay}
        canUndo={invoker.canUndo()}
        undoLabel={undoHint}
        onUndo={handleUndo}
        searchQuery={searchQuery}
        searchCategory={searchCategory}
        onSearchChange={setSearchQuery}
        onSearchCategoryChange={setSearchCategory}
        onSearchSubmit={() => {
          scrollToCatalog();
          showToast(
            filteredCatalog.length
              ? `Showing ${filteredCatalog.length} products`
              : 'No products match your search',
          );
        }}
        onCartClick={scrollToCart}
        onLogoClick={() => {
          scrollToCatalog();
          setSearchQuery('');
          setSearchCategory('all');
        }}
        onDeliverClick={() => {
          const zip = window.prompt('Enter delivery ZIP code:', '10001');
          if (zip) showToast(`Delivery updated to ZIP ${zip}`, 'success');
        }}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((o) => !o)}
        onNavAll={() => {
          setSearchCategory('all');
          setSearchQuery('');
          scrollToCatalog();
          showToast('Showing all departments', 'info');
        }}
        onNavDeals={() => {
          setSearchCategory('electronics');
          setSearchQuery('');
          scrollToCatalog();
          showToast("Today's Deals: electronics", 'info');
        }}
        onNavSupport={() => {
          showToast('Support: help@shopcart.demo — we reply within 24h', 'info');
        }}
        onNavGiftCards={() => {
          cart.applyCoupon('SUMMER10');
          scrollToCart();
          showToast('Applied SUMMER10 gift offer ($10 off)', 'success');
        }}
        onNavDemo={() => {
          scrollToCatalog();
          showToast('Design patterns demo — see README on GitHub', 'info');
        }}
      />

      <main className="store-main">
        <section className="catalog-section" ref={catalogRef}>
          <div className="catalog-hero">
            <h1>Shop deals in every category</h1>
            <p>Minimal storefront · Design patterns coursework demo</p>
          </div>

          {filteredCatalog.length === 0 ? (
            <p className="no-results">No products match your search. Try another category or term.</p>
          ) : (
            <div className="product-grid">
              {filteredCatalog.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onQuickView={(id) => {
                    addToCart(id);
                    scrollToCart();
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <CartPanel
          cartPanelRef={cartPanelRef}
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
          loadingPromos={loadingPromos}
          onStudentChange={(enabled) =>
            runCommand(new SetStudentDiscountCommand(cart, enabled))
          }
          onLoadPartnerPromos={loadPartnerPromos}
          onToggleAddOn={(id, addOn) => cart.toggleAddOn(id, addOn)}
          onCheckout={() => {
            if (cart.lines.length === 0) {
              showToast('Your cart is empty', 'info');
              return;
            }
            setCheckoutOpen(true);
          }}
        />
      </main>

      <footer className="store-footer">
        <p>© 2026 ShopCart · Software Design Patterns — Topic D</p>
      </footer>

      <Toast toast={toast} onClose={() => setToast(null)} />
      <CheckoutModal
        open={checkoutOpen}
        itemCount={cartCount}
        total={total}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
}
