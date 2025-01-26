import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../infra/repository/repository.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [RepositoryModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
