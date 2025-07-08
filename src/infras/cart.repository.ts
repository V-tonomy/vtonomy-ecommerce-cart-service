import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/domain/cart.entity';
import { CartDocument } from 'src/domain/cart.schema';
import { MongoRepository } from 'vtonomy';

@Injectable()
export class CartRepository extends MongoRepository<Cart, CartDocument> {
  constructor(
    @InjectModel('Cart')
    model: Model<CartDocument>,
  ) {
    super(model);
  }

  toDomain(doc: CartDocument): Cart {
    return new Cart(doc._id, doc.userId, doc.createdAt, doc.updatedAt);
  }

  fromDomain(domain: Cart): CartDocument {
    return new this.model({
      _id: domain.id,
      userId: domain.userId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
