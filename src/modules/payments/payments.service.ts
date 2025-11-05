import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../../common/enums/order-status.enum';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private ordersService: OrdersService,
    configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  // Create payment
  async createPayment(orderId: string, userId: string) {
    const order = await this.ordersService.findOne(orderId, userId);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalAmount) * 100),
      currency: 'usd',
    });

    const payment = await this.paymentsRepository.save({
      orderId,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      payment_intent: payment.stripePaymentIntentId,
    };
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );

    if (paymentIntent.status === 'succeeded') {
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentsRepository.save(payment);
      await this.ordersService.updateStatus(
        payment.orderId,
        OrderStatus.CONFIRMED,
      );
      return { success: true };
    }

    throw new BadRequestException('Payment failed');
  }
}
