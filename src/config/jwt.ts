import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload, StringValue } from '../types';
dotenv.config();

export class JwtMethod {
  private static accessSecret = process.env.JWT_ACCESS_SECRET!;
  private static accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '2d';

  static generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
    const options: SignOptions = {
      expiresIn: this.accessExpiresIn as StringValue | number,
    };
    return jwt.sign(payload, this.accessSecret, options);
  };

  static verifyAccessToken = (token: string): JwtPayload => {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

  static getTokenExpiration(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error('Invalid expiration format');
    }

    const value = parseInt(match[1]!);
    const unit = match[2]!;

    switch (unit) {
      case 's':
        return new Date(now.getTime() + value * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        throw new Error('Invalid time unit');
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
