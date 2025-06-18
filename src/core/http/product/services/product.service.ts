import { VerifyCategoryOwnershipService } from '@core/http/category/services/validateCategoryOwnership.service';
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
import { ListProductEntityType } from '@shared/types/Product.type';
import { VerifyOrgOwnershipService } from '../../org/services/verifyOrgOwnership.service';
import { UpdateProductDto } from '../dto/Input.dto';
import { ProductEntity } from '../entity/Product.entity';
import { VerifyProductOwnershipService } from './validateProductOwnership.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orgRepository: OrgRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly orgVerifyOwnershipService: VerifyOrgOwnershipService,
    private readonly productVerifyOwnershipService: VerifyProductOwnershipService,
    private readonly categoryVerifyOwnershipService: VerifyCategoryOwnershipService,
  ) {}

  async createProduct(
    productData: ProductEntity<string, string[], string>,
  ): Promise<ProductEntity<string, string[], string>> {
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
    if (ingredientExists.length !== productData.ingredients.length) {
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
    const product = await this.productRepository.createProduct(productData);

    if (!product) {
      throw new InternalServerErrorException('Erro ao criar o produto');
    }
    return product;
  }

  async listProduct(
    userId: string,
    orgId: string,
  ): Promise<ListProductEntityType[]> {
    await this.validateEntities({
      orgId,
      userId,
    });

    await this.orgRepository.orgExists(orgId);
    const products = await this.productRepository.listProducts(orgId);

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async listProductByCategory(
    userId: string,
    orgId: string,
    categoryId: string,
  ): Promise<ProductEntity<string, string[], string>[]> {
    await this.validateEntities({
      orgId,
      userId,
      categoryId,
    });

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

  async deleteProduct(
    userId: string,
    orgId: string,
    productId: string,
  ): Promise<boolean> {
    await this.validateEntities({
      orgId,
      userId,
      productId,
    });

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
    userId: string,
    orgId: string,
    productId: string,
    data: UpdateProductDto,
  ): Promise<ProductEntity<string, string[], string>> {
    await this.validateEntities({
      orgId,
      userId,
      productId,
    });

    await this.productRepository.getProduct(productId);

    if (data.ingredients) {
      const ingredientExists =
        await this.ingredientRepository.verfifyIngredients(data.ingredients);

      if (ingredientExists.length !== data.ingredients.length) {
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
    userId: string,
    orgId: string,
    productId: string,
    newPrice: number,
  ): Promise<ProductEntity<string, string[], string>> {
    if (!newPrice) {
      throw new BadRequestException('Um preço novo é obrigatório');
    }

    if (newPrice <= 0) {
      throw new BadRequestException(
        'Por favor, adicione um valor válido para o produto',
      );
    }

    await this.validateEntities({
      orgId,
      userId,
      productId,
    });

    await this.productRepository.getProduct(productId);

    const productInDiscount = await this.productRepository.putProductInDiscount(
      productId,
      newPrice,
    );

    return productInDiscount;
  }

  async removeDiscountOfProduct(
    userId: string,
    orgId: string,
    productId: string,
  ): Promise<ProductEntity<string, string[], string>> {
    await this.validateEntities({
      orgId,
      userId,
      productId,
    });

    await this.productRepository.getProduct(productId);

    const productWithoutDiscount =
      await this.productRepository.removeDiscountOfProduct(productId);

    return productWithoutDiscount;
  }

  async getAllDiscountProducts(
    userId: string,
    orgId: string,
  ): Promise<ProductEntity<string, string[], string>[]> {
    await this.validateEntities({
      orgId,
      userId,
    });
    await this.orgRepository.orgExists(orgId);
    const products =
      await this.productRepository.returnAllDiscountProducts(orgId);

    if (products.length === 0) {
      throw new HttpException(null, 204);
    }

    return products;
  }

  async getProduct(
    userId: string,
    orgId: string,
    productId: string,
  ): Promise<ListProductEntityType> {
    await this.validateEntities({
      orgId,
      userId,
      productId,
    });
    const product = await this.productRepository.getProduct(productId);
    return product;
  }

  private async validateEntities({
    productId,
    orgId,
    userId,
    categoryId,
  }: {
    userId: string;
    orgId: string;
    productId?: string;
    categoryId?: string;
  }) {
    await Promise.all([
      this.orgVerifyOwnershipService.verify(userId, orgId),
      productId && this.productVerifyOwnershipService.verify(orgId, productId),
      categoryId &&
        this.categoryVerifyOwnershipService.verify(orgId, categoryId),
    ]);
  }
}
