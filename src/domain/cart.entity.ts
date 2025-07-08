import { ICart } from './cart.interface';

export class Cart implements ICart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
