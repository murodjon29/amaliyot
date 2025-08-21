import { 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  MinLength, 
  IsArray, 
  ArrayMinSize, 
  IsMongoId 
} from "class-validator";

export class CreateProductDto {
  @IsString({ message: "Mahsulot nomi string bo‘lishi kerak" })
  @MinLength(2, { message: "Mahsulot nomi kamida 2 ta belgidan iborat bo‘lishi kerak" })
  name: string;

  @IsNumber({}, { message: "Narx raqam bo‘lishi kerak" })
  @IsPositive({ message: "Narx musbat son bo‘lishi kerak" })
  price: number;
  
  @IsOptional()
  @IsString({ message: "Description string bo‘lishi kerak" })
  description?: string;
  
  @IsOptional()
  @IsNumber({}, { message: "Miqdor raqam bo‘lishi kerak" })
  @IsPositive({ message: "Miqdor musbat son bo‘lishi kerak" })
  quantity: number = 1;

  // 📸 Images (MongoId lar bo‘lsa)
  @IsOptional()
  @IsArray({ message: "Images massiv bo‘lishi kerak" })
  @ArrayMinSize(1, { message: "Kamida bitta rasm bo‘lishi kerak" })
  @IsMongoId({ each: true, message: "Image ID noto‘g‘ri formatda" })
  images?: string[];
}
