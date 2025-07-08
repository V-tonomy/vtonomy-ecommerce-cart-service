import { ICommand } from '@nestjs/cqrs';

export class DeleteCartByIdCommand implements ICommand {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  static create(id: string) {
    return new DeleteCartByIdCommand(id);
  }
}
