import { Router } from 'express';
import { ProductController } from '../controller/product.controller';

const router = Router();

router.get('/', ProductController.getProducts);

export default router;
