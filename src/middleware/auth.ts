import { Request, Response, NextFunction } from 'express';
import { JwtMethod } from '../config/jwt';
import { AppError } from './error';

export interface AuthenticateRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticateRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = JwtMethod.extractTokenFromHeader(authHeader);

  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('Unauthorized', 401);
  }

  const decoded = JwtMethod.verifyAccessToken(token);

  req.user = {
    userId: decoded.userId,
    email: decoded.email,
  };
  next();
};
