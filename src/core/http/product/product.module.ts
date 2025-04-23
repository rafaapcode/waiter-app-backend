import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../../infra/repository/repository.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [RepositoryModule, UserModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
