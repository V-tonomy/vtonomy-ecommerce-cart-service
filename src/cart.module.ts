import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitmqModule } from 'vtonomy';
import { CART_HANDLER } from './core';
import { CartItemSchema, CartSchema } from './domain/cart.schema';
import { CartItemRepository } from './infras/cart-item.repository';
import { CartRepository } from './infras/cart.repository';
import { CartController } from './infras/cart.transport';

export const ICartRepositoryToken = Symbol('ICartRepository');
export const ICartItemRepositoryToken = Symbol('ICartItemRepository');

@Module({
  imports: [
    CqrsModule,
    RabbitmqModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/ecommerce',
    ),
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },
      { name: 'CartItem', schema: CartItemSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
    {
      provide: 'ICartItemRepository',
      useClass: CartItemRepository,
    },
    ...CART_HANDLER,
  ],
})
export class CartModule {}
