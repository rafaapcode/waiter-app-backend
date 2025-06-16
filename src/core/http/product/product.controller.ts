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
import { CurrentUser } from '@shared/decorators/getCurrentUser.decorator';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { Role } from '../authentication/roles/role.enum';
import { CreateProductDto, UpdateProductDto } from './dto/Input.dto';
import {
  OutPutCreateProductDto,
  OutPutDiscountProductDto,
  OutPutGetProductDto,
  OutPutListProductByCategorieDto,
  OutPutListProductDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':orgId')
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListProductDto, 'products'),
  )
  async listProducts(
    @CurrentUser() user: JwtPayload,
    @Param('orgId') orgId: string,
  ): Promise<OutPutListProductDto> {
    const products = await this.productService.listProduct(user.id, orgId);
    return {
      products: products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          discount: product.discount,
          priceInDiscount: product.priceInDiscount,
          ingredients: product.ingredients,
        };
      }),
    };
  }

  @Get('search/:productId')
  @UseInterceptors(new ResponseInterceptor(OutPutGetProductDto))
  async getProduct(
    @Param('productId') productId: string,
  ): Promise<OutPutGetProductDto> {
    const product = await this.productService.getProduct(productId);
    return product;
  }

  @Post('')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateProductDto))
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<OutPutCreateProductDto> {
    return await this.productService.createProduct(productData);
  }

  @Get('categorie/:categoryId/:orgId')
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListProductByCategorieDto, 'products'),
  )
  async listProductsByCategorie(
    @CurrentUser() user: JwtPayload,
    @Param() params: { categoryId: string; orgId: string },
  ): Promise<OutPutListProductByCategorieDto> {
    const { categoryId, orgId } = params;
    const products = await this.productService.listProductByCategory(
      user.id,
      orgId,
      categoryId,
    );
    return {
      products: products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          discount: product.discount,
          priceInDiscount: product.priceInDiscount,
          ingredients: product.ingredients,
        };
      }),
    };
  }

  @Delete(':productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<OutPutMessageDto> {
    await this.productService.deleteProduct(productId);
    return {
      message: 'Produto deletado com sucesso !',
    };
  }

  @Put(':productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<OutPutMessageDto> {
    await this.productService.updateProduct(productId, updateProduct);
    return {
      message: 'Produto atualizado com sucesso !',
    };
  }

  @Patch('/discount/add/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async putProductInDiscount(
    @Param('productId') productId: string,
    @Body() newPrice: { newPrice: number },
  ): Promise<OutPutMessageDto> {
    await this.productService.productInDiscount(productId, newPrice.newPrice);
    return {
      message: 'Desconto adicionado ao produto',
    };
  }

  @Patch('/discount/remove/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async removeProductInDiscount(
    @Param('productId') productId: string,
  ): Promise<OutPutMessageDto> {
    await this.productService.removeDiscountOfProduct(productId);
    return {
      message: 'Desconto removido do produto',
    };
  }

  @Get('/discount/products/:orgId')
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutDiscountProductDto, 'products'),
  )
  async getDiscountProducts(
    @CurrentUser() user: JwtPayload,
    @Param('orgId') orgId: string,
  ): Promise<OutPutDiscountProductDto> {
    const products = await this.productService.getAllDiscountProducts(
      user.id,
      orgId,
    );
    return {
      products: products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          discount: product.discount,
          priceInDiscount: product.priceInDiscount,
          ingredients: product.ingredients,
        };
      }),
    };
  }
}
