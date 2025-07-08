import { IRepository } from "vtonomy/dist/interface";

export interface ICart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartPersistant {}
export interface ICartItemPersistant {}

export interface ICartRepository
  extends IRepository<ICart, ICartPersistant> {}

export interface ICartItemRepository
  extends IRepository<ICartItem, ICartItemPersistant> {}
