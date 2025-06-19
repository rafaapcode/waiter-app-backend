import { CategoryRepository } from '@infra/repository/category/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VerifyCategoryOwnershipService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async verify(orgId: string, categoryId: string) {
    const isOwner = await this.categoryRepo.verifyCategoryOwnership(
      orgId,
      categoryId,
    );

    if (!isOwner) {
      throw new NotFoundException('Organização não encontrada');
    }
  }
}
