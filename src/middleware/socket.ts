import { Socket } from 'socket.io';
import { JwtMethod } from '../config/jwt';
import { NextFunction } from 'express';

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
  };
}

export const socketAuthMiddleware = (socket: AuthenticatedSocket, next: NextFunction) => {
  try {
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = JwtMethod.verifyAccessToken(token);

    socket.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
