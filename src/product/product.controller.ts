import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { extname } from 'path';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ Product yaratish + rasm yuklash
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // localga saqlanadi
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.create(dto, file);
  }

  // ✅ Barcha productlarni olish
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // ✅ Bitta product olish
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  // ✅ Yangilash + yangi rasm yuklash imkoniyati
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.update(id, dto, file);
  }

  // ✅ O‘chirish
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productService.remove(id);
  }
}
