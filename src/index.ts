import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error';
import authRouter from './router/authRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sample API route
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express TypeScript!' });
});

// Routes
app.use('/api/auth', authRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: 'Not Found' });
// });

// Error handler
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

app.listen(PORT, async () => {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected successfully');
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
});
