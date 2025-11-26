import { ProductService } from '../service/product.service';
import { Request, Response } from 'express';

export class ProductController {
  static async getProducts(req: Request, res: Response): Promise<void> {
    const products = await ProductService.getProducts();

    res.status(200).json(products);
  }
}
