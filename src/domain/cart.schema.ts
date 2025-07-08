import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CartMongo {
  @Prop({ required: true })
  _id: string;

  @Prop()
  userId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CartDocument = CartMongo & Document;
export const CartSchema = SchemaFactory.createForClass(CartMongo);

@Schema({ timestamps: true })
export class CartItemMongo {
  @Prop({ required: true })
  _id: string;

  @Prop()
  cartId: string;

  @Prop()
  productId: string;

  @Prop()
  quantity: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CartItemDocument = CartItemMongo & Document;
export const CartItemSchema = SchemaFactory.createForClass(CartItemMongo);
