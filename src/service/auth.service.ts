import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { JwtMethod } from '../config/jwt';
import { User } from '../entities/user.entity';
import { AppError } from '../middleware/error';
import { LoginRequest, RegisterRequest } from '../schema/auth.schema';
import { ApiResponse, AuthResponse, UserResponse } from '../types';
import { response } from 'express';

export class AuthService {
  private static userRespository = AppDataSource.getRepository(User);

  static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const { name, email, password } = data;

    const existingEmail = await this.userRespository.findOneBy({ email });

    if (existingEmail) {
      throw new AppError('User with this email already exists', 409);
    }

    // hash password
    const saltPassword = 12;
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const user = await this.userRespository.save({
      name,
      email,
      password: hashedPassword,
    });

    // create access token
    const accessToken = JwtMethod.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    };

    return response;
  }

  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const { email, password } = data;

    const user = await this.userRespository.findOneBy({ email });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = JwtMethod.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'User logged in successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    };

    return response;
  }

  static async logout(): Promise<ApiResponse<null>> {
    const response: ApiResponse<null> = {
      success: true,
      message: 'User logged out successfully',
      data: null,
    };

    return response;
  }

  static async getCurrentUser(userId: string): Promise<ApiResponse<UserResponse>> {
    const user = await this.userRespository.findOneBy({ id: userId });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse<UserResponse> = {
      success: true,
      message: 'User fetched successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    return response;
  }
}
