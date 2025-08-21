import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Image } from './emages.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Image.name }] })
  images: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
