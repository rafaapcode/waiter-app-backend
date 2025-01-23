import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from 'src/repository/category/category.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, CategoryRepository],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repo be defined', () => {
    expect(repo).toBeDefined();
  });
});
