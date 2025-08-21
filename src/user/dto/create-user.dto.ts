import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString, IsStrongPassword, Max, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsNumber()
    @Max(150)
    @Min(8)
    age: number;

    @IsBoolean()
    isActive: boolean;

    @IsEnum(['Block', 'Active'])
    isStatus: 'Block' | 'Active' = 'Active';
}
