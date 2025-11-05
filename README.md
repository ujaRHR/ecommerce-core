<div align="center">

## 🛒 E-Commerce Core REST API
A modern, scalable e-commerce REST API built with NestJS, TypeScript, and PostgreSQL. Features include authentication, product management, shopping cart, order processing, and Stripe payment integration.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, User, Seller)
- Secure password hashing with bcrypt

### 📦 Product Management
- Full CRUD operations
- Category organization
- Image support
- Stock management
- Redis caching for performance

### 🛒 Shopping Experience
- Real-time shopping cart
- Order creation and tracking
- Order history
- Product reviews and ratings

### 💳 Payment Processing
- Stripe integration
- Secure payment intents
- Payment confirmation
- Order status auto-update

### 🚀 Performance & Security
- Redis caching layer
- Rate limiting
- Input validation
- SQL injection protection
- CORS enabled

---

## ⚙️ Clean Modular Structure

```
ecommerce-core/
├── src/
│   ├── modules/         # Feature modules
│   │   ├── auth/            # Authentication & JWT
│   │   ├── users/           # User management
│   │   ├── products/        # Product catalog
│   │   ├── categories/      # Product categories
│   │   ├── cart/            # Shopping cart
│   │   ├── orders/          # Order processing
│   │   ├── payments/        # Stripe payments
│   │   └── reviews/         # Product reviews
│   │
│   ├── core/            # Infrastructure
│   │   ├── database/        # TypeORM config
│   │   └── cache/           # Redis service
│   │
│   ├── shared/          # Utilities
│   │   ├── guards/          # Auth guards
│   │   ├── decorators/      # Custom decorators
│   │   └── config/          # Database & Redis configs
│   │
│   ├── common/          # Common resources
│   │   └── enums/           # Status enums
│   │
│   ├── database/        # Migrations & seeds
│   └── main.ts          # Entry point
│
├── .env                 # Environment config
├── package.json
├── tsconfig.json
└── README.md
```

### Technology Stack

- **Language**: TypeScript
- **Framework**: NestJS 11
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM 0.3
- **Cache**: Redis (optional)
- **Payments**: Stripe

---

## Installation

```bash
# Clone repository
git clone https://github.com/ujaRHR/ecommerce-core.git
cd ecommerce-core

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
createdb ecommerce_core

# Run migrations
pnpm run migration:run

# Seed sample data (optional)
pnpm run seed

# Start development server
pnpm run start:dev
```

**Server runs at:** `http://localhost:3000/api`

---

## 📚 API Documentation

### Authentication

```http
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
```

### Products

```http
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product by ID
POST   /api/products           # Create product (admin/seller)
PATCH  /api/products/:id       # Update product (admin/seller)
DELETE /api/products/:id       # Delete product (admin)
```

### Shopping Cart

```http
GET    /api/cart               # Get user cart
POST   /api/cart               # Add item to cart
DELETE /api/cart/:id           # Remove item from cart
```

### Orders

```http
GET    /api/orders             # Get user orders
GET    /api/orders/:id         # Get order details
POST   /api/orders             # Create order from cart
PATCH  /api/orders/:id/status  # Update status (admin)
```

### Payments

```http
POST   /api/payments/create           # Create payment intent
POST   /api/payments/confirm/:id      # Confirm payment
```

### Categories

```http
GET    /api/categories         # Get all categories
GET    /api/categories/:id     # Get category by ID
POST   /api/categories         # Create category (admin)
```

### Reviews

```http
GET    /api/reviews/product/:id  # Get product reviews
POST   /api/reviews              # Create review
```

---

## 🔧 Configuration

### Payment Integration

#### Stripe Setup

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

#### Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success   |
| `4000 0000 0000 0002` | Declined  |

---

#### Default Credentials (after seeding)

- **Admin:** admin@rhraju.com / admin123
- **User:** user@rhraju.com / user123

---

## 🗄️ Database

### Migrations

```bash
# Run migrations
pnpm run migration:run

# Revert migration
pnpm run migration:revert

# Generate migration
pnpm run migration:generate -- src/database/migrations/MigrationName
```

### Schema

**8 Tables:**
- `users` - User accounts
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment records
- `reviews` - Product reviews

---

## 🎯 Key Features

### Modular Architecture
- ✅ Clean separation of concerns
- ✅ Easy to extend and maintain
- ✅ Microservices-ready
- ✅ Testable in isolation

### Performance
- ✅ Redis caching (5-minute TTL)
- ✅ Database indexing
- ✅ Query optimization
- ✅ Connection pooling

### Security
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection

---

## 🛠️ Development

1. Create module: `nest g module modules/feature-name`
2. Create service: `nest g service modules/feature-name`
3. Create controller: `nest g controller modules/feature-name`
4. Create entity in `entities/`
5. Create DTOs in `dto/`
6. Import module in `app.module.ts`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Reajul Hasan Raju**
- GitHub: [@ujaRHR](https://github.com/ujaRHR)
- Twitter: [R...](https://x.com/ujaRHR)
- Email: hello@rhraju.com

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript
- [Stripe](https://stripe.com/) - Payment processing platform
- [PostgreSQL](https://www.postgresql.org/) - Powerful database

---


## 🚧 Roadmap for Contributors

- [ ] Add email notifications
- [ ] Implement file upload (S3)
- [ ] Add search functionality (Elasticsearch)
- [ ] Implement webhooks for order updates
- [ ] Add GraphQL API
- [ ] Add real-time notifications (WebSocket)
- [ ] Implement admin dashboard
- [ ] Add multi-currency support
- [ ] Implement inventory management
- [ ] Add shipping integration

---

## 💡 Support

If you find this project helpful, please give it a ⭐️!

For issues and questions, please use the [GitHub Issues](https://github.com/ujaRHR/ecommerce-core/issues) page.

---

<p align="center">Made with ❤️ using NestJS</p>
