import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ➕ Create
  async create(data: Partial<User>) {
    try {
      const newUser = new this.userModel({ ...data, isActive: true });
      const savedUser = await newUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'success',
        data: savedUser,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Failed to create user',
        data: null,
      };
    }
  }

  // 📋 Find all
  async findAll() {
    try {
      const users = await this.userModel.find().exec();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: users,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Failed to fetch users',
        data: null,
      };
    }
  }

  // 🔍 Find one
  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User not found');

      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: user,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.NOT_FOUND,
        message: error.message || 'User not found',
        data: null,
      };
    }
  }

  // ✏️ Update
  async update(id: string, data: Partial<User>) {
    try {
      const updated = await this.userModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updated) throw new NotFoundException('User not found');

      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: updated,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.NOT_FOUND,
        message: error.message || 'Failed to update user',
        data: null,
      };
    }
  }

  // ❌ Delete
  async remove(id: string) {
    try {
      const deleted = await this.userModel.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundException('User not found');

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data: deleted,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.NOT_FOUND,
        message: error.message || 'Failed to delete user',
        data: null,
      };
    }
  }
}
