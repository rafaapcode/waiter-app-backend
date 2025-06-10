import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
  imports: [RepositoryModule, IngredientModule],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
