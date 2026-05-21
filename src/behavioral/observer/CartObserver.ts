import type { Cart } from '../../domain/Cart';

export interface CartObserver {
  onCartChanged(cart: Cart): void;
}
