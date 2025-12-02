import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schema/auth.schema';
import { AuthService } from '../service/auth.service';
import { AuthenticateRequest } from '../middleware/auth';
import { ApiResponse, UserResponse } from '../types';
import { AppError } from '../middleware/error';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await AuthService.register(parseResult.data);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', result.data?.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json(result.data);
  }

  static async login(req: Request, res: Response): Promise<void> {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await AuthService.login(parseResult.data);

    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', result.data?.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json(result.data);
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const result = await AuthService.logout();

    res.clearCookie('accessToken');

    res.status(200).json(result);
  }

  static async getProfile(req: AuthenticateRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }
    const userId = req.user.userId;

    const result = await AuthService.getCurrentUser(userId);

    const response: ApiResponse<UserResponse> = {
      success: true,
      message: 'User fetched successfully',
      data: result.data,
    };

    res.status(200).json(response);
  }
}
