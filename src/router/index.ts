import { Router } from 'express';
import authRouter from './authRoutes';
import productRouter from './productRoutes';
import chatRouter from './chatRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/chat', chatRouter);

export default router;
