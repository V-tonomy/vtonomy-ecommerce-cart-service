import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { ICartItemRepository, ICartRepository } from 'src/domain';
import { Cart, CartItem } from 'src/domain/cart.entity';
import {
  Cart_Created,
  Cart_Item_Created,
  Cart_Item_Updated,
  CLIENTS,
} from 'vtonomy';
import { CreateOrUpdateCartCommand } from '../command';

@CommandHandler(CreateOrUpdateCartCommand)
export class CreateCartHandler
  implements ICommandHandler<CreateOrUpdateCartCommand>
{
  constructor(
    @Inject('ICartRepository') private readonly cartRepository: ICartRepository,
    @Inject('ICartItemRepository')
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(CLIENTS.Search_Client) private readonly searchClient: ClientProxy,
  ) {}

  async execute(command: CreateOrUpdateCartCommand): Promise<string> {
    const { productId, quantity, userId, action } = command.props;

    let cart = await this.cartRepository.findOne({ userId });

    if (!cart) {
      const cartId = randomUUID();
      cart = new Cart(cartId, userId, new Date(), new Date());
      await this.cartRepository.insert(cart);
      this.searchClient.send(Cart_Created, cart).subscribe();
    }

    const cartId = cart.id;

    const existingItem = await this.cartItemRepository.findOne({
      cartId,
      productId,
    });

    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.updatedAt = new Date();

      await this.cartItemRepository.updateById(existingItem.id, { quantity });
      this.searchClient.send(Cart_Item_Updated, existingItem).subscribe();
      return existingItem.id;
    } else {
      const cartItemId = randomUUID();
      const newItem = new CartItem(
        cartItemId,
        cartId,
        productId,
        quantity,
        new Date(),
        new Date(),
      );

      await this.cartItemRepository.insert(newItem);
      this.searchClient.send(Cart_Item_Created, newItem).subscribe();
      return cartItemId;
    }
  }
}
