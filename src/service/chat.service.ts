import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Message } from '../entities/message.entity';
import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { AppError } from '../middleware/error';
import { CreateRoomRequest, SendMessageRequest } from '../schema/chat.schema';
import { ApiResponse } from '../types';

export class ChatService {
  private static messageRepository = AppDataSource.getRepository(Message);
  private static roomRepository = AppDataSource.getRepository(Room);
  private static userRepository = AppDataSource.getRepository(User);

  static async createRoom(data: CreateRoomRequest, userId: string): Promise<ApiResponse<Room>> {
    const { name, description, memberIds } = data;
    const allMemberIds = [...new Set([userId, ...memberIds])];

    if (allMemberIds.length < 2) {
      throw new AppError('At least two members are required', 400);
    }

    const members = await this.userRepository.find({
      where: {
        id: In(allMemberIds),
      },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    if (members.length !== allMemberIds.length) {
      throw new AppError('User not found', 404);
    }

    const room = await this.roomRepository.save({
      name,
      description,
      createdBy: userId,
      members,
    });

    const response = {
      success: true,
      message: 'Room created successfully',
      data: room,
    };

    return response;
  }

  static async getRooms(userId: string): Promise<ApiResponse<Room[]>> {
    const rooms = await this.roomRepository.find({
      where: {
        members: {
          id: userId,
        },
      },
      relations: ['members'],
      order: {
        createdAt: 'DESC',
      },
    });

    const response = {
      success: true,
      message: 'Rooms fetched successfully',
      data: rooms,
    };

    return response;
  }

  static async getRoom(roomId: string, userId: string): Promise<ApiResponse<Room>> {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
        members: {
          id: userId,
        },
      },
      relations: ['members'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!room) {
      throw new AppError('Room not found', 404);
    }

    const response = {
      success: true,
      message: 'Room fetched successfully',
      data: room,
    };

    return response;
  }

  static async sendMessage(
    data: SendMessageRequest,
    userId: string,
  ): Promise<ApiResponse<Message>> {
    const { content, roomId } = data;

    if (roomId) {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
          members: {
            id: userId,
          },
        },
      });

      if (!room) {
        throw new AppError('Room not found', 404);
      }
    }

    const message = await this.messageRepository.save({
      content,
      userId,
      roomId,
    });

    const response = {
      success: true,
      message: 'Message sent successfully',
      data: message,
    };

    return response;
  }

  static async getMessages(
    roomId: string,
    userId: string,
    limit: number = 50,
  ): Promise<ApiResponse<Message[]>> {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
        members: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!room) {
      throw new AppError('Room not found', 404);
    }

    const messages = await this.messageRepository.find({
      where: { roomId },
      relations: ['user'],
      order: {
        createdAt: 'ASC',
      },
      take: limit,
    });

    const response = {
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
    };

    return response;
  }
}
