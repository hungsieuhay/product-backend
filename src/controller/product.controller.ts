import { productSchema, updateProductSchema } from '../schema/product.schema';
import { ProductService } from '../service/product.service';
import { Request, Response } from 'express';

export class ProductController {
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await ProductService.getAllProducts();

    res.status(200).json(products);
  }

  static async getProduct(req: Request, res: Response): Promise<void> {
    const product = await ProductService.getProduct(req.params.id);

    res.status(200).json(product);
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    const parseResult = productSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await ProductService.createProduct(parseResult.data);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(201).json(result.data);
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    const result = await ProductService.deleteProduct(req.params.id);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    const parseResult = updateProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((err) => err.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors,
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const result = await ProductService.updateProduct(req.params.id, parseResult.data);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }
}
