import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Product } from 'src/types/Product.type';
import { CreateProductDTO } from './dto/Product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async listProducts(): Promise<Product[]> {
    return await this.productService.listProduct();
  }

  @Post('')
  async createProduct(@Body() productData: CreateProductDTO): Promise<Product> {
    return await this.productService.createProduct(productData);
  }

  @Get('/:categoryId')
  async listProductsByCategorie(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return await this.productService.listProductByCategory(categoryId);
  }

  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<boolean> {
    return await this.productService.deleteProduct(productId);
  }
}
