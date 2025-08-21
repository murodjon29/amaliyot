import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)  // string → number
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)  // string → number
  @IsPositive()
  quantity: number;

  // Agar form-data bilan fayl kelsa validatsiya uchun
  // Multer `file`ni DTO ichida `Express.Multer.File` tipida olish kerak
  file: Express.Multer.File;
}
