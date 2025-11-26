import { AppDataSource } from '../config/database';
import { Product } from '../entities/product.entity';
import { ApiResponse } from '../types';

export class ProductService {
  private static productRespository = AppDataSource.getRepository(Product);

  static async getProducts(): Promise<ApiResponse<Product[]>> {
    const products = await this.productRespository.find();

    const response: ApiResponse<Product[]> = {
      success: true,
      message: 'Products fetched successfully',
      data: products,
    };

    return response;
  }
}
