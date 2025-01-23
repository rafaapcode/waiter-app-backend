import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/repository/product/product.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let product: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, ProductRepository],
    }).compile();

    service = module.get<ProductService>(ProductService);
    product = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should product be defined', () => {
    expect(product).toBeDefined();
  });
});
