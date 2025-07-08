import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrUpdateCartCommand, DeleteCartByIdCommand } from 'src/core';
import { CreateOrUpdateCartItemDTO } from 'src/core/dto/cart.dto';
import { JwtAuthGuard, MessageResponseDTO, ResponseDTO } from 'vtonomy';

@Controller('cart')
export class CartController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async insert(@Req() req, @Body() body: CreateOrUpdateCartItemDTO) {
    const userId = req.user.id;
    const id = await this.commandBus.execute(
      CreateOrUpdateCartCommand.create({ ...body, userId }),
    );
    return new ResponseDTO(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    await this.commandBus.execute(DeleteCartByIdCommand.create(id));
    return new MessageResponseDTO(`Delete Cart with id: ${id} success`);
  }
}
