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
import { Product } from 'src/types/Product.type';
import { CreateProductDTO } from './dto/Product.dto';
import {
  createProductSchemaRes,
  getProductSchemaRes,
  ResponseCreateProductDTO,
} from './dto/response-create-product';
import {
  deleteProductSchemaRes,
  ResponseDeleteProductDTO,
} from './dto/response-delete-product';
import {
  discountsProductSchemaRes,
  ResponseDiscountsProductDTO,
} from './dto/response-discounts-product';
import {
  listProductSchemaRes,
  ResponseListProductDTO,
} from './dto/response-list-product';
import {
  ResponseUpdateProductDTO,
  updateProductSchemaRes,
} from './dto/response-update-product';
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

  @Get('/:productId')
  @UseInterceptors(new ResponseInterceptor(getProductSchemaRes))
  async getProduct(@Param('productId') productId: string): Promise<Product> {
    const product = await this.productService.getProduct(productId);
    return product;
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
  @UseInterceptors(new ResponseInterceptor(deleteProductSchemaRes))
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<ResponseDeleteProductDTO> {
    await this.productService.deleteProduct(productId);
    return {
      message: 'Produto deletado com sucesso !',
    };
  }

  @Put('/:productId')
  @UseInterceptors(new ResponseInterceptor(updateProductSchemaRes))
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProduct: UpdateProductDTO,
  ): Promise<ResponseUpdateProductDTO> {
    await this.productService.updateProduct(productId, updateProduct);
    return {
      message: 'Produto atualizado com sucesso !',
    };
  }

  @Patch('/discount/add/:productId')
  @UseInterceptors(new ResponseInterceptor(discountsProductSchemaRes))
  async putProductInDiscount(
    @Param('productId') productId: string,
    @Body() newPrice: { newPrice: number },
  ): Promise<ResponseDiscountsProductDTO> {
    await this.productService.productInDiscount(productId, newPrice.newPrice);
    return {
      message: 'Desconto adicionado ao produto',
    };
  }

  @Patch('/discount/remove/:productId')
  @UseInterceptors(new ResponseInterceptor(discountsProductSchemaRes))
  async removeProductInDiscount(
    @Param('productId') productId: string,
  ): Promise<ResponseDiscountsProductDTO> {
    await this.productService.removeDiscountOfProduct(productId);
    return {
      message: 'Desconto removido do produto',
    };
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
