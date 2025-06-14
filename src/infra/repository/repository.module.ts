import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category/category.provider';
import { CategoryRepository } from './category/category.repository';
import { ingredientProvider } from './ingredients/ingredient.provider';
import { IngredientRepository } from './ingredients/ingredients.repository';
import { orderProviders } from './order/order.provider';
import { OrderRepository } from './order/order.repository';
import { orgProvider } from './org/org.provider';
import { OrgRepository } from './org/org.repository';
import { productProviders } from './product/product.provider';
import { ProductRepository } from './product/product.repository';
import { userProvider } from './user/user.provider';
import { UserRepository } from './user/user.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...categoryProviders,
    ...orderProviders,
    ...productProviders,
    ...userProvider,
    ...ingredientProvider,
    ...orgProvider,
    CategoryRepository,
    OrderRepository,
    ProductRepository,
    UserRepository,
    IngredientRepository,
    OrgRepository,
  ],
  exports: [
    CategoryRepository,
    OrderRepository,
    ProductRepository,
    UserRepository,
    IngredientRepository,
    OrgRepository,
  ],
})
export class RepositoryModule {}
