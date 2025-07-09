import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CLIENTS, CoreModule } from 'vtonomy';
import { CART_HANDLER } from './core';
import { CartItemSchema, CartSchema } from './domain/cart.schema';
import { CartItemRepository } from './infras/cart-item.repository';
import { CartRepository } from './infras/cart.repository';
import { CartController } from './infras/cart.transport';

export const ICartRepositoryToken = Symbol('ICartRepository');
export const ICartItemRepositoryToken = Symbol('ICartItemRepository');

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/ecommerce',
    ),
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },
      { name: 'CartItem', schema: CartItemSchema },
    ]),
    ClientsModule.register([
      {
        name: CLIENTS.Search_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'search_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: CLIENTS.Mail_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: CLIENTS.Auth_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
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
