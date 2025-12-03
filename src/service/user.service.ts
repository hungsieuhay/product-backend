import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { ApiResponse, UserResponse } from '../types';

export class UserService {
  private static userRespository = AppDataSource.getRepository(User);

  static async getUsers(): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.userRespository.find({
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    const response = {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    };

    return response;
  }
}
