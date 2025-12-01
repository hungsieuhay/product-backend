import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { AppError } from '../middleware/error';
import { ApiResponse } from '../types';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductRequest,
} from '../schema/product.schema';
import { faker } from '@faker-js/faker';

interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  private static productRespository = AppDataSource.getRepository(Product);
  private static categoryRespository = AppDataSource.getRepository(Category);

  static async getAllProducts(params: ProductRequest): Promise<ApiResponse<ProductResponse>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const [products, total] = await this.productRespository.findAndCount({
      relations: ['categories'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const response: ApiResponse<ProductResponse> = {
      success: true,
      message: 'Products fetched successfully',
      data: {
        items: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return response;
  }

  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    const product = await this.productRespository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const response: ApiResponse<Product> = {
      success: true,
      message: 'Product fetched successfully',
      data: product,
    };

    return response;
  }

  static async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    const categories =
      data.categoryIds && data.categoryIds.length > 0
        ? await this.categoryRespository.find({ where: { id: In(data.categoryIds) } })
        : [];

    const product = this.productRespository.create({
      name: data.name,
      image: faker.image.urlPicsumPhotos({
        width: 600,
        height: 600,
        grayscale: false,
        blur: 0,
      }),
      price: data.price,
      description: data.description,
      categories,
    });

    await this.productRespository.save(product);

    const response: ApiResponse<Product> = {
      success: true,
      message: 'Product created successfully',
      data: product,
    };

    return response;
  }

  static async deleteProduct(id: string): Promise<ApiResponse> {
    const product = await this.productRespository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.categories = [];
    await this.productRespository.save(product);
    await this.productRespository.remove(product);

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully',
      data: null,
    };

    return response;
  }

  static async updateProduct(
    id: string,
    data: UpdateProductRequest,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productRespository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.image !== undefined) product.image = data.image;
    if (data.price !== undefined) product.price = data.price;
    if (data.description !== undefined) product.description = data.description;

    if (data.categoryIds) {
      const categories = await this.categoryRespository.find({
        where: { id: In(data.categoryIds) },
      });
      product.categories = categories;
    }

    await this.productRespository.save(product);

    const response: ApiResponse<Product> = {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };

    return response;
  }
}
