import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
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
  @UseGuards(UserGuard)
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListProductDto, 'products'),
  )
  async listProducts(
    @Param('orgId') orgId: string,
  ): Promise<OutPutListProductDto> {
    const products = await this.productService.listProduct(orgId);
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

  @Get('/:productId')
  @UseGuards(UserGuard)
  @UseInterceptors(new ResponseInterceptor(OutPutGetProductDto))
  async getProduct(
    @Param('productId') productId: string,
  ): Promise<OutPutGetProductDto> {
    const product = await this.productService.getProduct(productId);
    return product;
  }

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateProductDto))
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<OutPutCreateProductDto> {
    return await this.productService.createProduct(productData);
  }

  @Get('categorie/:categoryId/:orgId')
  @UseGuards(UserGuard)
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListProductByCategorieDto, 'products'),
  )
  async listProductsByCategorie(
    @Param() params: { categoryId: string; orgId: string },
  ): Promise<OutPutListProductByCategorieDto> {
    const { categoryId, orgId } = params;
    const products = await this.productService.listProductByCategory(
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

  @Delete('/:productId')
  @UseGuards(UserGuard)
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

  @Put('/:productId')
  @UseGuards(UserGuard)
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
  @UseGuards(UserGuard)
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
  @UseGuards(UserGuard)
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
  @UseGuards(UserGuard)
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutDiscountProductDto, 'products'),
  )
  async getDiscountProducts(
    @Param('orgId') orgId: string,
  ): Promise<OutPutDiscountProductDto> {
    const products = await this.productService.getAllDiscountProducts(orgId);
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
