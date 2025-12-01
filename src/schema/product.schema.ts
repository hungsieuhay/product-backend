import * as z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(255, { message: 'Product name must be at most 255 characters' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(255, { message: 'Product name must be at most 255 characters' })
    .optional(),
  image: z.string({ message: 'Image must be a valid URL' }).optional(),
  price: z.number({ message: 'Price must be a positive number' }).positive().optional(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type UpdateProductRequest = z.infer<typeof updateProductSchema>;

export const productSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .refine((val) => val > 0, { message: 'Limit must be greater than 0' }),
});

export type ProductRequest = z.infer<typeof productSchema>;
