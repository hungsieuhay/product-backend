import { Router } from 'express';
import authRouter from './authRoutes';
import productRouter from './productRoutes';
import chatRouter from './chatRoutes';
import userRouter from './userRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/chat', chatRouter);
router.use('/users', userRouter);

export default router;
