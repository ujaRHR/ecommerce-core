import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from '../../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  async createOrder(userId: string, shippingAddress: string): Promise<Order> {
    const cartItems = await this.cartService.findByUser(userId);

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const cartItem of cartItems) {
      if (cartItem.product.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${cartItem.product.name}`,
        );
      }

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      });

      totalAmount += Number(cartItem.product.price) * cartItem.quantity;
    }

    // Create order
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    const orderItemEntities = orderItems.map((item) =>
      this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );
    await this.orderItemsRepository.save(orderItemEntities);

    // Update product stock
    for (const cartItem of cartItems) {
      await this.productsService.update(cartItem.productId, {
        stock: cartItem.product.stock - cartItem.quantity,
      });
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    // Return order with items
    return this.findOne(savedOrder.id);
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await this.ordersRepository.findOne({
      where,
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = status;
    return this.ordersRepository.save(order);
  }
}
