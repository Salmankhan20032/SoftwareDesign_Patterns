import type { ProductCategory } from '../domain/Product';
import {
  BookOpen,
  Headphones,
  Laptop,
  Shirt,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; icon: LucideIcon; gradient: string }
> = {
  electronics: {
    label: 'Electronics',
    icon: Laptop,
    gradient: 'linear-gradient(145deg, #232f3e 0%, #37475a 100%)',
  },
  clothing: {
    label: 'Fashion',
    icon: Shirt,
    gradient: 'linear-gradient(145deg, #c7511f 0%, #ff9900 55%, #febd69 100%)',
  },
  books: {
    label: 'Books',
    icon: BookOpen,
    gradient: 'linear-gradient(145deg, #146eb4 0%, #48a6e8 100%)',
  },
  food: {
    label: 'Grocery',
    icon: UtensilsCrossed,
    gradient: 'linear-gradient(145deg, #067d62 0%, #3db88a 100%)',
  },
};

export const PRODUCT_ICONS: Record<string, LucideIcon> = {
  p1: Headphones,
  p2: Laptop,
  p3: Shirt,
  p4: BookOpen,
  p5: UtensilsCrossed,
  p6: ShoppingBag,
};

export const PRODUCT_RATINGS: Record<string, { stars: number; count: number }> = {
  p1: { stars: 4.5, count: 2847 },
  p2: { stars: 4.3, count: 1204 },
  p3: { stars: 4.6, count: 892 },
  p4: { stars: 4.8, count: 5621 },
  p5: { stars: 4.4, count: 331 },
  p6: { stars: 4.7, count: 4102 },
};
