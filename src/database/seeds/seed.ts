import { AppDataSource } from '../data-source';
import { User } from '../../modules/users/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('Starting database seed...');

  await AppDataSource.initialize();
  console.log('Database connected', AppDataSource.isInitialized);

  const userRepository = AppDataSource.getRepository(User);
  const categoryRepository = AppDataSource.getRepository(Category);
  const productRepository = AppDataSource.getRepository(Product);

  console.log('Clearing existing data...');

  await AppDataSource.query('TRUNCATE TABLE "reviews" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "payments" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "order_items" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "orders" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "cart_items" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "products" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "categories" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "users" CASCADE');

  console.log('Cleared existing data');

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    email: 'admin@rhraju.com',
    password: hashedPassword,
    firstName: 'Reajul Hasan',
    lastName: 'Raju',
    role: UserRole.ADMIN,
    phone: '+1234567890',
    address: '123 Admin Street, Chittagong, Bangladesh',
  });
  await userRepository.save(admin);
  console.log(':: Admin user created (admin@rhraju.com / admin123)');

  // Regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = userRepository.create({
    email: 'user@rhraju.com',
    password: userPassword,
    firstName: 'Sample',
    lastName: 'User',
    role: UserRole.USER,
    phone: '+1987654321',
    address: '456 User Street, Dhaka, Bangladesh',
  });
  await userRepository.save(user);
  console.log(':: Regular user created (user@rhraju.com / user123)');

  // Creating categories
  const categories = [
    {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      slug: 'electronics',
    },
    {
      name: 'Clothing',
      description: 'Fashion and apparel',
      slug: 'clothing',
    },
    {
      name: 'Books',
      description: 'Books and literature',
      slug: 'books',
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      slug: 'home-garden',
    },
    {
      name: 'Sports',
      description: 'Sports equipment and accessories',
      slug: 'sports',
    },
  ];

  const savedCategories = await categoryRepository.save(categories);
  console.log(`:: Created ${savedCategories.length} categories`);

  // Creating products
  const products = [
    // Electronics
    {
      name: 'Laptop Pro 15',
      description: 'High-performance laptop with 16GB RAM and 512GB SSD',
      price: 1299.99,
      stock: 50,
      imageUrl: 'https://placehold.co/300x300?text=Laptop',
      slug: 'laptop-pro-15',
      categoryId: savedCategories[0].id,
      isActive: true,
    },
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling Bluetooth headphones',
      price: 199.99,
      stock: 100,
      imageUrl: 'https://placehold.co/300x300?text=Headphones',
      slug: 'wireless-headphones',
      categoryId: savedCategories[0].id,
      isActive: true,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracking smartwatch with heart rate monitor',
      price: 299.99,
      stock: 75,
      imageUrl: 'https://placehold.co/300x300?text=Watch',
      slug: 'smart-watch',
      categoryId: savedCategories[0].id,
      isActive: true,
    },
    // Clothing
    {
      name: 'Classic T-Shirt',
      description: '100% cotton comfortable t-shirt',
      price: 24.99,
      stock: 200,
      imageUrl: 'https://placehold.co/300x300?text=T-Shirt',
      slug: 'classic-t-shirt',
      categoryId: savedCategories[1].id,
      isActive: true,
    },
    {
      name: 'Denim Jeans',
      description: 'Premium quality denim jeans',
      price: 79.99,
      stock: 150,
      imageUrl: 'https://placehold.co/300x300?text=Jeans',
      slug: 'denim-jeans',
      categoryId: savedCategories[1].id,
      isActive: true,
    },
    // Books
    {
      name: 'TypeScript Handbook',
      description: 'Complete guide to TypeScript programming',
      price: 39.99,
      stock: 80,
      imageUrl: 'https://placehold.co/300x300?text=Book',
      slug: 'typescript-handbook',
      categoryId: savedCategories[2].id,
      isActive: true,
    },
    {
      name: 'Node.js Best Practices',
      description: 'Learn Node.js development best practices',
      price: 44.99,
      stock: 60,
      imageUrl: 'https://placehold.co/300x300?text=Book',
      slug: 'nodejs-best-practices',
      categoryId: savedCategories[2].id,
      isActive: true,
    },
    // Home & Garden
    {
      name: 'Kitchen Mixer',
      description: 'Professional stand mixer for baking',
      price: 249.99,
      stock: 40,
      imageUrl: 'https://placehold.co/300x300?text=Mixer',
      slug: 'kitchen-mixer',
      categoryId: savedCategories[3].id,
      isActive: true,
    },
    {
      name: 'Garden Tool Set',
      description: 'Complete set of essential gardening tools',
      price: 89.99,
      stock: 55,
      imageUrl: 'https://placehold.co/300x300?text=Tools',
      slug: 'garden-tool-set',
      categoryId: savedCategories[3].id,
      isActive: true,
    },
    // Sports
    {
      name: 'Yoga Mat',
      description: 'Non-slip exercise yoga mat',
      price: 29.99,
      stock: 120,
      imageUrl: 'https://placehold.co/300x300?text=Yoga+Mat',
      slug: 'yoga-mat',
      categoryId: savedCategories[4].id,
      isActive: true,
    },
    {
      name: 'Dumbbell Set',
      description: 'Adjustable dumbbell set 5-25kg',
      price: 149.99,
      stock: 45,
      imageUrl: 'https://placehold.co/300x300?text=Dumbbells',
      slug: 'dumbbell-set',
      categoryId: savedCategories[4].id,
      isActive: true,
    },
  ];

  const savedProducts = await productRepository.save(products);
  console.log(`:: Created ${savedProducts.length} products`);

  await AppDataSource.destroy();
  console.log(':: Database seeding completed successfully!');
  console.log('\n:: Login credentials:');
  console.log('   Admin: admin@rhraju.com / admin123');
  console.log('   User:  user@rhraju.com / user123');
}

seed().catch((error) => {
  console.error(':: Seed failed:', error);
  process.exit(1);
});
