import { useEffect, useState } from 'react';
import type { CartObserver } from '../behavioral/observer/CartObserver';
import type { Cart } from '../domain/Cart';

/** Subscribes to cart Observer notifications — replaces manual refresh ticks. */
export function useCartObserver(cart: Cart): void {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const observer: CartObserver = {
      onCartChanged: () => setVersion((v) => v + 1),
    };
    cart.subscribe(observer);
    return () => cart.unsubscribe(observer);
  }, [cart]);
}
