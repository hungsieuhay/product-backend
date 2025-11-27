import { Router } from 'express';
import { ProductController } from '../controller/product.controller';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProduct);
router.post('/', ProductController.createProduct);
router.delete('/:id', ProductController.deleteProduct);
router.put('/:id', ProductController.updateProduct);

export default router;
