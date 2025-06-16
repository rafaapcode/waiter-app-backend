import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [RepositoryModule, UserModule, OrgModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
