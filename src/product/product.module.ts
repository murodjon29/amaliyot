import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema,} from './schema/product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Image, ImageSchema } from './schema/emages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Image.name, schema: ImageSchema},
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
