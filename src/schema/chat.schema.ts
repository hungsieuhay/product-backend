import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  memberIds: z.array(z.string()),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  roomId: z.string().optional(),
  recipientId: z.string().optional(),
});

export const joinRoomSchema = z.object({
  roomId: z.string(),
});

export type CreateRoomRequest = z.infer<typeof createRoomSchema>;
export type SendMessageRequest = z.infer<typeof sendMessageSchema>;
export type JoinRoomRequest = z.infer<typeof joinRoomSchema>;
