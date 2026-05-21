import type { Cart } from '../../../domain/Cart';
import type { CartCommand } from '../CartCommand';

export class AddItemCommand implements CartCommand {
  readonly label: string;
  private added = false;
  private readonly cart: Cart;
  private readonly productId: string;
  private readonly quantity: number;

  constructor(cart: Cart, productId: string, quantity: number, productName?: string) {
    this.cart = cart;
    this.productId = productId;
    this.quantity = quantity;
    this.label = `Add ${productName ?? productId}`;
  }

  execute(): void {
    this.added = this.cart.addFromCatalog(this.productId, this.quantity);
  }

  undo(): void {
    if (!this.added) return;
    this.cart.removeItem(this.productId);
  }
}
