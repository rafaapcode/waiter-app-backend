import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/repository/category/category.service';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
}
