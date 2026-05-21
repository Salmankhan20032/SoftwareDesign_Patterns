import type { Cart } from '../../../domain/Cart';
import type { CartCommand } from '../CartCommand';

export class SetStudentDiscountCommand implements CartCommand {
  readonly label: string;
  private previous = false;
  private readonly cart: Cart;
  private readonly enabled: boolean;

  constructor(cart: Cart, enabled: boolean) {
    this.cart = cart;
    this.enabled = enabled;
    this.label = enabled ? 'Enable student discount' : 'Disable student discount';
  }

  execute(): void {
    this.previous = this.cart.isStudent;
    this.cart.setStudentDiscount(this.enabled);
  }

  undo(): void {
    this.cart.setStudentDiscount(this.previous);
  }
}
