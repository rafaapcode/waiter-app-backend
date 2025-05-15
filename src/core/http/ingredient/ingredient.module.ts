import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infra/repository/repository.module';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
  imports: [RepositoryModule, IngredientModule],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
