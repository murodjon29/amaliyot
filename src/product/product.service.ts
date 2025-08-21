import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Image } from './schema/emages.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Image.name) private imageModel: Model<Image>,
  ) {}

  private baseUrl = process.env.BASE_URL || 'http://13.222.190.158:3000';

  async create(dto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    let imageDoc: Image | null = null;

    if (file) {
      imageDoc = new this.imageModel({
        url: `${this.baseUrl}/uploads/${file.filename}`,
      });
      await imageDoc.save();
    }

    const product = new this.productModel({
      ...dto,
      images: imageDoc ? [imageDoc._id as Types.ObjectId] : [],
    });

    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('images').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('images').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    dto: Partial<CreateProductDto>,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).populate('images').exec();
    if (!product) throw new NotFoundException('Product not found');

    if (file) {
      // eski rasmlarni o‘chirib yuboramiz
      if (product.images && product.images.length > 0) {
        const oldImageIds = product.images.map((img: any) => img._id);
        await this.imageModel.deleteMany({ _id: { $in: oldImageIds } });
      }

      // yangi rasm yaratamiz
      const imageDoc = new this.imageModel({
        url: `${this.baseUrl}/uploads/${file.filename}`,
      });
      await imageDoc.save();

      // faqat yangi rasmni biriktiramiz
      product.images = [imageDoc._id as Types.ObjectId];
    }

    Object.assign(product, dto);
    return product.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');

    // unga bog‘liq rasmlarni ham o‘chiramiz
    if (product.images && product.images.length > 0) {
      await this.imageModel.deleteMany({ _id: { $in: product.images } });
    }

    return { message: 'Product deleted successfully' };
  }
}
