import { OrderRepository } from '@infra/repository/order/order.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VerifyOrderOwnershipService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async verify(orgId: string, orderId: string) {
    const isOwner = await this.orderRepo.verifyOrderOwnership(orderId, orgId);

    if (!isOwner) {
      throw new NotFoundException('Organização não encontrada');
    }
  }
}
