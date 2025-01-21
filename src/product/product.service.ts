import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/repository/product/product.service';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
}
