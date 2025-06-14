import { OrderRepository } from '@infra/repository/order/order.repository';
import { ProductRepository } from '@infra/repository/product/product.repository';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ListProductsType, ProductType } from '@shared/types/Product.type';
import { CreateProductDto, UpdateProductDto } from './dto/Input.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createProduct(
    productData: CreateProductDto,
  ): Promise<ProductType<string, string>> {
    const productExists = await this.productRepository.productExists(
      productData.name,
      productData.org,
    );
    if (productExists) {
      throw new BadRequestException(
        `${productData.name} já existe, crie um produto com nome diferente.`,
      );
    }
    const product = await this.productRepository.createProduct({
      ...productData,
      imageUrl:
        productData.imageUrl ||
        'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
    });

    if (!product) {
      throw new InternalServerErrorException('Erro ao criar o produto');
    }
    return product;
  }

  async listProduct(orgId: string): Promise<ListProductsType[]> {
    const products = await this.productRepository.listProducts(orgId);

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async listProductByCategory(
    orgId: string,
    categoryId: string,
  ): Promise<ProductType<string, string>[]> {
    const products = await this.productRepository.listProductsByCategorie(
      orgId,
      categoryId,
    );

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado nessa categoria');
    }

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const productIsAlreadyBeingUsed =
      await this.orderRepository.productIsBeingUsed(productId);

    if (productIsAlreadyBeingUsed) {
      throw new BadRequestException(
        'Produto está sendo usado em algum PEDIDO.',
      );
    }

    const productDeleted =
      await this.productRepository.deleteProduct(productId);

    if (!productDeleted) {
      throw new NotFoundException('Produto não encontrado !');
    }

    return true;
  }

  async updateProduct(
    productId: string,
    data: UpdateProductDto,
  ): Promise<ProductType<string, string>> {
    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      data,
    );

    if (!updatedProduct) {
      throw new NotFoundException('Nenhum produto encontrado !');
    }

    return updatedProduct;
  }

  async productInDiscount(
    productId: string,
    newPrice: number,
  ): Promise<ProductType<string, string>> {
    if (!newPrice) {
      throw new BadRequestException('Um preço novo é obrigatório');
    }

    if (newPrice <= 0) {
      throw new BadRequestException(
        'Por favor, adicione um valor válido para o produto',
      );
    }

    const productInDiscount = await this.productRepository.putProductInDiscount(
      productId,
      newPrice,
    );

    if (!productInDiscount) {
      throw new NotFoundException('Produto não encontrado');
    }

    return productInDiscount;
  }

  async removeDiscountOfProduct(
    productId: string,
  ): Promise<ProductType<string, string>> {
    const productWithoutDiscount =
      await this.productRepository.removeDiscountOfProduct(productId);

    if (!productWithoutDiscount) {
      throw new NotFoundException('Produto não encontrado');
    }

    return productWithoutDiscount;
  }

  async getAllDiscountProducts(
    orgId: string,
  ): Promise<ProductType<string, string>[]> {
    const products =
      await this.productRepository.returnAllDiscountProducts(orgId);

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async getProduct(productId: string): Promise<ListProductsType> {
    const product = await this.productRepository.getProduct(productId);

    if (!product) {
      throw new NotFoundException('Product não encontrado');
    }

    return product;
  }
}
