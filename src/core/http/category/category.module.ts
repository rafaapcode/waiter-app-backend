import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './services/category.service';
import { VerifyCategoryOwnershipService } from './services/validateCategoryOwnership.service';

@Module({
  imports: [RepositoryModule, UserModule, OrgModule],
  providers: [CategoryService, VerifyCategoryOwnershipService],
  controllers: [CategoryController],
  exports: [VerifyCategoryOwnershipService],
})
export class CategoryModule {}
