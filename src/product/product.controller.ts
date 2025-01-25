import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { Product } from 'src/types/Product.type';
import { CreateProductDTO, createProductSchema } from './dto/Product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async listProducts(): Promise<Product[]> {
    return await this.productService.listProduct();
  }

  @Post('')
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() productData: CreateProductDTO): Promise<Product> {
    return await this.productService.createProduct(productData);
  }

  @Get('/:categoryId')
  async listProductsByCategorie(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return await this.productService.listProductByCategory(categoryId);
  }
}
