import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
  ) {}

  findByUser(userId: string) {
    return this.cartRepository.find({ 
      where: { userId },
      relations: ['product'],
    });
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const existing = await this.cartRepository.findOne({ 
      where: { userId, productId } 
    });

    if (existing) {
      existing.quantity += quantity;
      return this.cartRepository.save(existing);
    }

    return this.cartRepository.save({ userId, productId, quantity });
  }

  async removeItem(id: string) {
    await this.cartRepository.delete(id);
  }

  async clearCart(userId: string) {
    await this.cartRepository.delete({ userId });
  }
}
