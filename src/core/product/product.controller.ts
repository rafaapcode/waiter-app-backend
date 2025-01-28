import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { Product } from '../../types/Product.type';
import { CreateProductDTO } from './dto/Product.dto';
import {
  createProductSchemaRes,
  ResponseCreateProductDTO,
} from './dto/response-create-product';
import {
  listProductSchemaRes,
  ResponseListProductDTO,
} from './dto/response-list-product';
import { UpdateProductDTO } from './dto/UpdateProduct.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  @UseInterceptors(new ResponseInterceptor(listProductSchemaRes))
  async listProducts(): Promise<ResponseListProductDTO> {
    const products = await this.productService.listProduct();
    return products.map((product) => {
      return {
        _id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        category: product.category,
        discount: product.discount,
        priceInDiscount: product.priceInDiscount,
        ingredients: product.ingredients,
      };
    });
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor(createProductSchemaRes))
  async createProduct(
    @Body() productData: CreateProductDTO,
  ): Promise<ResponseCreateProductDTO> {
    return await this.productService.createProduct(productData);
  }

  @Get('/:categoryId')
  @UseInterceptors(new ResponseInterceptor(listProductSchemaRes))
  async listProductsByCategorie(
    @Param('categoryId') categoryId: string,
  ): Promise<ResponseListProductDTO> {
    const products =
      await this.productService.listProductByCategory(categoryId);
    return products.map((product) => {
      return {
        _id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        category: product.category,
        discount: product.discount,
        priceInDiscount: product.priceInDiscount,
        ingredients: product.ingredients,
      };
    });
  }

  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<boolean> {
    return await this.productService.deleteProduct(productId);
  }

  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProduct: UpdateProductDTO,
  ): Promise<Product> {
    return await this.productService.updateProduct(productId, updateProduct);
  }

  @Patch('/discount/add/:productId')
  async putProductInDiscount(
    @Param('productId') productId: string,
    @Body() newPrice: { newPrice: number },
  ): Promise<Product> {
    return await this.productService.productInDiscount(
      productId,
      newPrice.newPrice,
    );
  }

  @Patch('/discount/remove/:productId')
  async removeProductInDiscount(
    @Param('productId') productId: string,
  ): Promise<Product> {
    return await this.productService.removeDiscountOfProduct(productId);
  }

  @Get('/discount/products')
  @UseInterceptors(new ResponseInterceptor(listProductSchemaRes))
  async getDiscountProducts(): Promise<ResponseListProductDTO> {
    const products = await this.productService.getAllDiscountProducts();
    return products.map((product) => {
      return {
        _id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        category: product.category,
        discount: product.discount,
        priceInDiscount: product.priceInDiscount,
        ingredients: product.ingredients,
      };
    });
  }
}
