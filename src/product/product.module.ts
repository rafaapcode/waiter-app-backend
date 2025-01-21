import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [RepositoryModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
