import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Product } from 'src/types/Product.type';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async listProducts(): Promise<Product[]> {
    return await this.productService.listProduct();
  }

  @Post('')
  async createProduct(@Body() productData: any): Promise<Product> {
    return await this.productService.createProduct(productData);
  }

  @Get('/:categoryId')
  async listProductsByCategorie(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return await this.productService.listProductByCategory(categoryId);
  }
}
