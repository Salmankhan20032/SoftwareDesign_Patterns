import {
  MapPin,
  Menu,
  RotateCcw,
  Search,
  ShoppingCart,
  Undo2,
  X,
} from 'lucide-react';
import type { ProductCategory } from '../domain/Product';

export type SearchCategory = 'all' | ProductCategory;

interface StoreHeaderProps {
  cartCount: number;
  cartTotal: string;
  canUndo: boolean;
  undoLabel: string | null;
  onUndo: () => void;
  searchQuery: string;
  searchCategory: SearchCategory;
  onSearchChange: (q: string) => void;
  onSearchCategoryChange: (cat: SearchCategory) => void;
  onSearchSubmit: () => void;
  onCartClick: () => void;
  onLogoClick: () => void;
  onDeliverClick: () => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onNavDeals: () => void;
  onNavSupport: () => void;
  onNavGiftCards: () => void;
  onNavAll: () => void;
  onNavDemo: () => void;
}

export function StoreHeader({
  cartCount,
  cartTotal,
  canUndo,
  undoLabel,
  onUndo,
  searchQuery,
  searchCategory,
  onSearchChange,
  onSearchCategoryChange,
  onSearchSubmit,
  onCartClick,
  onLogoClick,
  onDeliverClick,
  mobileMenuOpen,
  onMobileMenuToggle,
  onNavDeals,
  onNavSupport,
  onNavGiftCards,
  onNavAll,
  onNavDemo,
}: StoreHeaderProps) {
  return (
    <>
      <header className="store-header">
        <div className="header-inner">
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={onMobileMenuToggle}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <button type="button" className="logo" onClick={onLogoClick}>
            <span className="logo-smile" />
            <span className="logo-text">shop</span>
            <span className="logo-dot">.cart</span>
          </button>

          <button type="button" className="deliver-to desktop-only" onClick={onDeliverClick}>
            <MapPin size={18} className="deliver-icon" />
            <div>
              <span className="deliver-label">Deliver to</span>
              <strong>Your Location</strong>
            </div>
          </button>

          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
          >
            <select
              className="search-category"
              aria-label="Search category"
              value={searchCategory}
              onChange={(e) => onSearchCategoryChange(e.target.value as SearchCategory)}
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Fashion</option>
              <option value="books">Books</option>
              <option value="food">Grocery</option>
            </select>
            <input
              type="search"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="search-submit" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          <nav className="header-nav desktop-only">
            <button
              type="button"
              className="nav-link"
              onClick={onUndo}
              disabled={!canUndo}
              title={undoLabel ?? 'Undo'}
            >
              <Undo2 size={18} />
              <span>Undo</span>
            </button>
          </nav>

          <button
            type="button"
            className="cart-badge"
            onClick={onCartClick}
            aria-label={`Cart, ${cartCount} items, total ${cartTotal}`}
          >
            <ShoppingCart size={28} strokeWidth={1.75} />
            <span className="cart-count">{cartCount}</span>
            <div className="cart-badge-text desktop-only">
              <span className="cart-label">Cart</span>
              <strong key={cartTotal}>{cartTotal}</strong>
            </div>
          </button>
        </div>
      </header>

      <div className="subnav">
        <div className="subnav-inner">
          <button type="button" className="subnav-all" onClick={onNavAll}>
            <Menu size={16} />
            All
          </button>
          <button type="button" className="subnav-link" onClick={onNavDeals}>
            Today&apos;s Deals
          </button>
          <button type="button" className="subnav-link" onClick={onNavSupport}>
            Customer Service
          </button>
          <button type="button" className="subnav-link" onClick={onNavGiftCards}>
            Gift Cards
          </button>
          <button type="button" className="subnav-link subnav-accent" onClick={onNavDemo}>
            <RotateCcw size={14} />
            Design Patterns Demo
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button type="button" onClick={onNavAll}>
            All departments
          </button>
          <button type="button" onClick={onNavDeals}>
            Today&apos;s Deals
          </button>
          <button type="button" onClick={onNavSupport}>
            Customer Service
          </button>
          <button type="button" onClick={onNavGiftCards}>
            Gift Cards
          </button>
          <button type="button" onClick={onCartClick}>
            View cart ({cartCount}) — {cartTotal}
          </button>
          <button type="button" onClick={onDeliverClick}>
            Change delivery location
          </button>
          <button type="button" onClick={onUndo} disabled={!canUndo}>
            Undo last action
          </button>
        </div>
      )}
    </>
  );
}
