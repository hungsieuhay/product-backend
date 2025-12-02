import { createRoomSchema, sendMessageSchema } from '../schema/chat.schema';
import { Request, Response } from 'express';
import { ChatService } from '../service/chat.service';
import { AuthenticateRequest } from '../middleware/auth';

export class ChatController {
  static async createZoom(req: AuthenticateRequest, res: Response): Promise<void> {
    const parseResult = createRoomSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await ChatService.createRoom(parseResult.data, req.user?.userId as string);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }

  static async getRooms(req: AuthenticateRequest, res: Response): Promise<void> {
    const rooms = await ChatService.getRooms(req.user?.userId as string);

    if (!rooms.success) {
      res.status(500).json(rooms);
      return;
    }

    res.status(200).json(rooms);
  }

  static async getRoom(req: AuthenticateRequest, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = await ChatService.getRoom(roomId, req.user?.userId as string);

    if (!room.success) {
      res.status(500).json(room);
      return;
    }

    res.status(200).json(room);
  }

  static async sendMessage(req: AuthenticateRequest, res: Response): Promise<void> {
    const parseResult = sendMessageSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await ChatService.sendMessage(parseResult.data, req.user?.userId as string);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }

  static async getMessages(req: AuthenticateRequest, res: Response): Promise<void> {
    const { roomId } = req.params;
    const result = await ChatService.getMessages(roomId, req.user?.userId as string);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }
}
