import { Injectable } from '@nestjs/common';
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

  async create(dto: CreateProductDto, file?: Express.Multer.File): Promise<{ statusCode: number; message: string; data: Product | null }> {
    try {
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

      const saved = await product.save();

      return {
        statusCode: 201,
        message: 'success',
        data: saved,
      };
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message || 'Product yaratishda xatolik',
        data: null,
      };
    }
  }

  async findAll(): Promise<{ statusCode: number; message: string; data: Product[] | null }> {
    try {
      const products = await this.productModel.find().populate('images').exec();
      return {
        statusCode: 200,
        message: 'success',
        data: products,
      };
    } catch (err) {
      return {
        statusCode: 500,
        message: err.message || 'Mahsulotlarni olishda xatolik',
        data: null,
      };
    }
  }

  async findOne(id: string): Promise<{ statusCode: number; message: string; data: Product | null }> {
    try {
      const product = await this.productModel.findById(id).populate('images').exec();
      if (!product) {
        return {
          statusCode: 404,
          message: 'Product topilmadi',
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'success',
        data: product,
      };
    } catch (err) {
      return {
        statusCode: 500,
        message: err.message || 'Productni olishda xatolik',
        data: null,
      };
    }
  }

  async update(id: string, dto: Partial<CreateProductDto>, file?: Express.Multer.File): Promise<{ statusCode: number; message: string; data: Product | null }> {
    try {
      const product = await this.productModel.findById(id).populate('images').exec();
      if (!product) {
        return {
          statusCode: 404,
          message: 'Product topilmadi',
          data: null,
        };
      }

      if (file) {
        if (product.images && product.images.length > 0) {
          const oldImageIds = product.images.map((img: any) => img._id);
          await this.imageModel.deleteMany({ _id: { $in: oldImageIds } });
        }

        const imageDoc = new this.imageModel({
          url: `${this.baseUrl}/uploads/${file.filename}`,
        });
        await imageDoc.save();

        product.images = [imageDoc._id as Types.ObjectId];
      }

      Object.assign(product, dto);
      const updated = await product.save();

      return {
        statusCode: 200,
        message: 'success',
        data: updated,
      };
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message || 'Product yangilashda xatolik',
        data: null,
      };
    }
  }

  async remove(id: string): Promise<{ statusCode: number; message: string; data: null }> {
    try {
      const product = await this.productModel.findByIdAndDelete(id);
      if (!product) {
        return {
          statusCode: 404,
          message: 'Product topilmadi',
          data: null,
        };
      }

      if (product.images && product.images.length > 0) {
        await this.imageModel.deleteMany({ _id: { $in: product.images } });
      }

      return {
        statusCode: 200,
        message: 'success',
        data: null,
      };
    } catch (err) {
      return {
        statusCode: 500,
        message: err.message || 'Productni o‘chirishda xatolik',
        data: null,
      };
    }
  }
}
