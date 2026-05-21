import {
  MapPin,
  Menu,
  RotateCcw,
  Search,
  ShoppingCart,
  Undo2,
} from 'lucide-react';

interface StoreHeaderProps {
  cartCount: number;
  cartTotal: string;
  canUndo: boolean;
  undoLabel: string | null;
  onUndo: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function StoreHeader({
  cartCount,
  cartTotal,
  canUndo,
  undoLabel,
  onUndo,
  searchQuery,
  onSearchChange,
}: StoreHeaderProps) {
  return (
    <>
      <header className="store-header">
        <div className="header-inner">
          <button type="button" className="icon-btn mobile-only" aria-label="Menu">
            <Menu size={22} />
          </button>

          <a href="/" className="logo" onClick={(e) => e.preventDefault()}>
            <span className="logo-smile" />
            <span className="logo-text">shop</span>
            <span className="logo-dot">.cart</span>
          </a>

          <div className="deliver-to desktop-only">
            <MapPin size={18} className="deliver-icon" />
            <div>
              <span className="deliver-label">Deliver to</span>
              <strong>Your Location</strong>
            </div>
          </div>

          <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
            <select className="search-category" aria-label="Search category" defaultValue="all">
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
            <button type="button" className="nav-link" onClick={onUndo} disabled={!canUndo} title={undoLabel ?? 'Undo'}>
              <Undo2 size={18} />
              <span>Undo</span>
            </button>
          </nav>

          <div className="cart-badge">
            <ShoppingCart size={28} strokeWidth={1.75} />
            <span className="cart-count">{cartCount}</span>
            <div className="cart-badge-text desktop-only">
              <span className="cart-label">Cart</span>
              <strong>{cartTotal}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="subnav">
        <div className="subnav-inner">
          <button type="button" className="subnav-all">
            <Menu size={16} />
            All
          </button>
          <span>Today&apos;s Deals</span>
          <span>Customer Service</span>
          <span>Gift Cards</span>
          <span className="subnav-accent">
            <RotateCcw size={14} />
            Design Patterns Demo
          </span>
        </div>
      </div>
    </>
  );
}
