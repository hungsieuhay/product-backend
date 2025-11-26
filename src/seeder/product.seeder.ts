import { AppDataSource } from '../config/database';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { faker } from '@faker-js/faker';

AppDataSource.initialize().then(async () => {
  const productRepository = AppDataSource.getRepository(Product);
  const categoryRepository = AppDataSource.getRepository(Category);

  const categoryNames = new Set<string>();

  while (categoryNames.size < 5) {
    categoryNames.add(faker.commerce.department());
  }

  const categories: Category[] = [];

  for (const name of categoryNames) {
    const category = new Category();
    category.name = name;

    await categoryRepository.save(category);
    categories.push(category);
  }

  for (let i = 0; i < 30; i++) {
    const product = new Product();

    product.name = faker.commerce.productName();
    product.image = faker.image.urlPicsumPhotos({
      width: 600,
      height: 600,
      grayscale: false,
      blur: 0,
    });
    product.price = Number(faker.finance.amount({ min: 10, max: 2000, dec: 2 }));
    product.description = faker.commerce.productDescription();

    product.categories = faker.helpers.arrayElements(
      categories,
      faker.number.int({ min: 1, max: 3 }),
    );

    await productRepository.save(product);
  }

  process.exit(0);
});
