import { ProductRepository } from '@infra/repository/product/product.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VerifyProductOwnershipService {
  constructor(private readonly product: ProductRepository) {}

  async verify(orgId: string, productId: string) {
    const isOwner = await this.product.verifyProductOwnership(orgId, productId);

    if (!isOwner) {
      throw new NotFoundException('Organização não encontrada');
    }
  }
}
