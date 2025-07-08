import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { ICartItemRepository, ICartRepository } from 'src/domain';
import { Cart_Item_Deleted, CLIENTS } from 'vtonomy';
import { DeleteCartByIdCommand } from '../command';

@CommandHandler(DeleteCartByIdCommand)
export class DeleteCartByIdHandler
  implements ICommandHandler<DeleteCartByIdCommand>
{
  constructor(
    @Inject('ICartRepository') private readonly cartRepository: ICartRepository,
    @Inject('ICartItemRepository')
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(CLIENTS.Search_Client) private readonly searchService: ClientProxy,
  ) {}
  async execute(command: DeleteCartByIdCommand): Promise<void> {
    const id = command.id;

    try {
      await this.cartItemRepository.deleteById(id);
      this.searchService.send(Cart_Item_Deleted, { id }).subscribe();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
