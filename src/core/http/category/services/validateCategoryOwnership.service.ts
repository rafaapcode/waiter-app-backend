import { CategoryRepository } from '@infra/repository/category/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VerifyCategoryOwnershipService {
  constructor(private readonly category: CategoryRepository) {}

  async verify(orgId: string, categoryId: string) {
    const isOwner = await this.category.verifyCategoryOwnership(
      orgId,
      categoryId,
    );

    if (!isOwner) {
      throw new NotFoundException('Organização não encontrada');
    }
  }
}
