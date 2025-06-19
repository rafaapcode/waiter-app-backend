import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { ProductEntity } from './entity/Product.entity';
import { ProductService } from './services/product.service';

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
    return ProductEntity.httpListProductsResponse(products);
  }

  @Get('search/:orgId/:productId')
  @UseInterceptors(new ResponseInterceptor(OutPutGetProductDto))
  async getProduct(
    @CurrentUser() user: JwtPayload,
    @Param() params: { productId: string; orgId: string },
  ): Promise<OutPutGetProductDto> {
    const { orgId, productId } = params;
    const product = await this.productService.getProduct(
      user.id,
      orgId,
      productId,
    );
    return product.httpGetProductsResponse();
  }

  @Post('')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateProductDto))
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<OutPutCreateProductDto> {
    const product = ProductEntity.newProduct(productData);
    const productCreated = await this.productService.createProduct(product);
    return productCreated.httpCreateProductsResponse();
  }

  @Get('categorie/:orgId/:categoryId')
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
    return ProductEntity.httpListProductsByCategorieResponse(products);
  }

  @Delete(':orgId/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteProduct(
    @CurrentUser() user: JwtPayload,
    @Param() params: { productId: string; orgId: string },
  ): Promise<OutPutMessageDto> {
    const { orgId, productId } = params;
    await this.productService.deleteProduct(user.id, orgId, productId);
    return {
      message: 'Produto deletado com sucesso !',
    };
  }

  @Patch(':orgId/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async updateProduct(
    @CurrentUser() user: JwtPayload,
    @Param() params: { productId: string; orgId: string },
    @Body() updateProduct: UpdateProductDto,
  ): Promise<OutPutMessageDto> {
    const { orgId, productId } = params;

    const dataToUpdate = ProductEntity.toUpdate(updateProduct);

    await this.productService.updateProduct(
      user.id,
      orgId,
      productId,
      dataToUpdate,
    );
    return {
      message: 'Produto atualizado com sucesso !',
    };
  }

  @Patch('/discount/add/:orgId/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async putProductInDiscount(
    @CurrentUser() user: JwtPayload,
    @Param() params: { productId: string; orgId: string },
    @Body() newPrice: { newPrice: number },
  ): Promise<OutPutMessageDto> {
    const { orgId, productId } = params;
    await this.productService.productInDiscount(
      user.id,
      orgId,
      productId,
      newPrice.newPrice,
    );
    return {
      message: 'Desconto adicionado ao produto',
    };
  }

  @Patch('/discount/remove/:orgId/:productId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async removeProductInDiscount(
    @CurrentUser() user: JwtPayload,
    @Param() params: { productId: string; orgId: string },
  ): Promise<OutPutMessageDto> {
    const { orgId, productId } = params;
    await this.productService.removeDiscountOfProduct(
      user.id,
      orgId,
      productId,
    );
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
    return ProductEntity.httpGetDiscountProductsResponse(products);
  }
}
