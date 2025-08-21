import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ➕ Create
  async create(data: Partial<User>): Promise<User> {
    const newUser = new this.userModel({...data, isActive: true});
    return newUser.save();
  }

  // 📋 Find all
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // 🔍 Find one
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ✏️ Update
  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  // ❌ Delete
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
