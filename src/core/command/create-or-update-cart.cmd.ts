import { ICommand } from '@nestjs/cqrs';
import { CreateOrUpdateCartItemDTO } from '../dto/cart.dto';

type CreateOrUpdateCartDTO = CreateOrUpdateCartItemDTO & { userId: string };

export class CreateOrUpdateCartCommand implements ICommand {
  public props: CreateOrUpdateCartDTO;

  constructor(props: CreateOrUpdateCartDTO) {
    this.props = props;
  }

  static create(props: CreateOrUpdateCartDTO) {
    return new CreateOrUpdateCartCommand(props);
  }
}
