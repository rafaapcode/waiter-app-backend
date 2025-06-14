import { CategoryRepository } from '@infra/repository/category/category.repository';
import { IngredientRepository } from '@infra/repository/ingredients/ingredients.repository';
import { OrderRepository } from '@infra/repository/order/order.repository';
import { OrgRepository } from '@infra/repository/org/org.repository';
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
    private readonly orgRepository: OrgRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async createProduct(
    productData: CreateProductDto,
  ): Promise<ProductType<string, string>> {
    await this.orgRepository.orgExists(productData.org);

    const categoryExists = await this.categoryRepository.findCategoryById(
      productData.category,
    );

    if (!categoryExists) {
      throw new NotFoundException(
        'Categoria não encontrada, escolha outra ou crie uma.',
      );
    }

    const ingredientExists = await this.ingredientRepository.verfifyIngredients(
      productData.ingredients,
    );

    if (ingredientExists.data.length !== productData.ingredients.length) {
      throw new NotFoundException('Um ou mais ingredientes não existem');
    }

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
    await this.orgRepository.orgExists(orgId);
    const products = await this.productRepository.listProducts(orgId);

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async listProductByCategory(
    orgId: string,
    categoryId: string,
  ): Promise<ProductType<string, string>[]> {
    await this.orgRepository.orgExists(orgId);
    const products = await this.productRepository.listProductsByCategorie(
      orgId,
      categoryId,
    );

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    await this.productRepository.getProduct(productId);

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
    await this.productRepository.getProduct(productId);

    if (data.ingredients) {
      const ingredientExists =
        await this.ingredientRepository.verfifyIngredients(data.ingredients);

      if (ingredientExists.data.length !== data.ingredients.length) {
        throw new NotFoundException('Um ou mais ingredientes não existem');
      }
    }

    if (data.category) {
      const categoryExists = await this.categoryRepository.findCategoryById(
        data.category,
      );

      if (!categoryExists) {
        throw new NotFoundException(
          'Categoria não encontrada, escolha outra ou crie uma.',
        );
      }
    }

    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      data,
    );

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

    await this.productRepository.getProduct(productId);

    const productInDiscount = await this.productRepository.putProductInDiscount(
      productId,
      newPrice,
    );

    return productInDiscount;
  }

  async removeDiscountOfProduct(
    productId: string,
  ): Promise<ProductType<string, string>> {
    await this.productRepository.getProduct(productId);

    const productWithoutDiscount =
      await this.productRepository.removeDiscountOfProduct(productId);

    return productWithoutDiscount;
  }

  async getAllDiscountProducts(
    orgId: string,
  ): Promise<ProductType<string, string>[]> {
    await this.orgRepository.orgExists(orgId);
    const products =
      await this.productRepository.returnAllDiscountProducts(orgId);

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async getProduct(productId: string): Promise<ListProductsType> {
    const product = await this.productRepository.getProduct(productId);
    return product;
  }
}
