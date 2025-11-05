import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1699999999999 implements MigrationInterface {
  name = 'InitialMigration1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user',
                "phone" character varying,
                "address" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // categories table
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "slug" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id")
            )
        `);

    // products table
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "stock" integer NOT NULL DEFAULT 0,
                "imageUrl" character varying,
                "slug" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "categoryId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_products" PRIMARY KEY ("id"),
                CONSTRAINT "FK_products_category" FOREIGN KEY ("categoryId") 
                    REFERENCES "categories"("id") ON DELETE CASCADE
            )
        `);

    // cart_items table
    await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "quantity" integer NOT NULL DEFAULT 1,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cart_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_cart_items_user" FOREIGN KEY ("userId") 
                    REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_cart_items_product" FOREIGN KEY ("productId") 
                    REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);

    // orders table
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "totalAmount" numeric(10,2) NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "shippingAddress" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
                CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") 
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

    // order_items table
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric(10,2) NOT NULL,
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") 
                    REFERENCES "orders"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_order_items_product" FOREIGN KEY ("productId") 
                    REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);

    // payments table
    await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderId" uuid NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "stripePaymentIntentId" character varying,
                "paymentMethod" character varying NOT NULL DEFAULT 'stripe',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_payments_order" FOREIGN KEY ("orderId") 
                    REFERENCES "orders"("id") ON DELETE CASCADE
            )
        `);

    // reviews table
    await queryRunner.query(`
            CREATE TABLE "reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "rating" integer NOT NULL,
                "comment" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
                CONSTRAINT "FK_reviews_user" FOREIGN KEY ("userId") 
                    REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_reviews_product" FOREIGN KEY ("productId") 
                    REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);

    // indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_products_category" ON "products" ("categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_user" ON "cart_items" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_user" ON "orders" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_product" ON "reviews" ("productId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
