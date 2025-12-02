import { Router } from 'express';
import { ChatController } from '../controller/chat.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/rooms', authenticateToken, ChatController.createZoom);
router.get('/rooms', authenticateToken, ChatController.getRooms);
router.get('/rooms/:roomId', authenticateToken, ChatController.getRoom);
router.post('/rooms/messages', authenticateToken, ChatController.sendMessage);
router.get('/rooms/:roomId/messages', authenticateToken, ChatController.getMessages);

export default router;
