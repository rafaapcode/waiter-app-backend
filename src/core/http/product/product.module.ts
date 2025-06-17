import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import { VerifyProductOwnershipService } from './services/validateProductOwnership.service';

@Module({
  imports: [RepositoryModule, UserModule, OrgModule, CategoryModule],
  providers: [ProductService, VerifyProductOwnershipService],
  controllers: [ProductController],
})
export class ProductModule {}
