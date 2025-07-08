import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem } from 'src/domain/cart.entity';
import { CartItemDocument } from 'src/domain/cart.schema';
import { MongoRepository } from 'vtonomy';

@Injectable()
export class CartItemRepository extends MongoRepository<
  CartItem,
  CartItemDocument
> {
  constructor(
    @InjectModel('CartItem')
    model: Model<CartItemDocument>,
  ) {
    super(model);
  }

  toDomain(doc: CartItemDocument): CartItem {
    return new CartItem(
      doc._id,
      doc.cartId,
      doc.productId,
      doc.quantity,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  fromDomain(domain: CartItem): CartItemDocument {
    return new this.model({
      _id: domain.id,
      productId: domain.productId,
      quantity: domain.quantity,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
