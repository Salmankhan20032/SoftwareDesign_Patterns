import { Plus, Star } from 'lucide-react';
import type { Product } from '../domain/Product';
import { CATEGORY_META, PRODUCT_ICONS, PRODUCT_RATINGS } from '../data/productMeta';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => void;
  onQuickView?: (id: string) => void;
}

export function ProductCard({ product, onAdd, onQuickView }: ProductCardProps) {
  const meta = CATEGORY_META[product.category];
  const Icon = PRODUCT_ICONS[product.id] ?? meta.icon;
  const rating = PRODUCT_RATINGS[product.id] ?? { stars: 4.5, count: 100 };
  const { whole, frac } = formatPrice(product.price);

  return (
    <article className="product-card">
      <div className="product-image" style={{ background: meta.gradient }}>
        <Icon size={48} strokeWidth={1.25} className="product-image-icon" />
        <span className="product-category-pill">{meta.label}</span>
      </div>
      <div className="product-body">
        <button
          type="button"
          className="product-title"
          onClick={() => onQuickView?.(product.id)}
        >
          {product.name}
        </button>
        <div className="product-rating">
          <div className="stars" aria-label={`${rating.stars} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating.stars) ? 'star-filled' : 'star-empty'}
                fill={i < Math.floor(rating.stars) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="rating-count">{rating.count.toLocaleString()}</span>
        </div>
        <div className="product-price">
          <span className="price-whole">${whole}</span>
          <span className="price-frac">{frac}</span>
        </div>
        <p className="product-prime">FREE delivery on eligible orders</p>
        <button type="button" className="btn-add-cart" onClick={() => onAdd(product.id)}>
          <Plus size={18} strokeWidth={2.5} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
