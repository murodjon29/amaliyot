import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ➕ Create user
  @Post()
  async create(@Body() dto: Partial<User>): Promise<User> {
    return this.userService.create(dto);
  }

  // 📋 Get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 🔍 Get one user
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  // ✏️ Update user
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<User>,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  // ❌ Delete user
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.remove(id);
  }
}
