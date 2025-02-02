import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../../../infra/repository/product/product.service';
import { Product } from '../../../types/Product.type';
import { validateSchema } from '../../../utils/validateSchema';
import { CreateProductDTO, createProductSchema } from './dto/Product.dto';
import { UpdateProductDTO, updateProductSchema } from './dto/UpdateProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const validateData = validateSchema(createProductSchema, productData);

      if (!validateData.success) {
        throw new BadRequestException(validateData.error.errors);
      }

      const productExists = await this.productRepository.productExists(
        productData.name,
      );

      if (productExists) {
        throw new BadRequestException(
          `${productData.name} já existe, crie um produto com nome diferente.`,
        );
      }

      const product = await this.productRepository.crateProduct({
        ...productData,
        imageUrl: productData.imageUrl || '',
      });

      if (!product) {
        throw new InternalServerErrorException('Erro ao criar o produto');
      }

      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async listProduct(): Promise<Product[]> {
    try {
      const products = await this.productRepository.listProducts();

      if (!products) {
        throw new NotFoundException('Nenhum produto encontrado');
      }

      if (products.length === 0) {
        throw new HttpException(null, 204);
      }

      return products;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async listProductByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products =
        await this.productRepository.listProductsByCategorie(categoryId);
      if (!products) {
        throw new NotFoundException(
          'Nenhum produto encontrado nessa categoria',
        );
      }

      if (products.length === 0) {
        throw new HttpException(null, 204);
      }

      return products;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const productDeleted =
        await this.productRepository.deleteProduct(productId);

      if (!productDeleted) {
        throw new NotFoundException('Produto não encontrado !');
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProduct(
    productId: string,
    data: UpdateProductDTO,
  ): Promise<Product> {
    try {
      if (data.category) {
        throw new BadRequestException(
          'Não é permitido trocar a categoria de um produto',
        );
      }

      const validateData = validateSchema(updateProductSchema, data);

      if (!validateData.success) {
        throw new BadRequestException(validateData.error.errors);
      }

      const updatedProduct = await this.productRepository.updateProduct(
        productId,
        data,
      );

      if (!updatedProduct) {
        throw new NotFoundException('Nenhum produto encontrado !');
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async productInDiscount(
    productId: string,
    newPrice: number,
  ): Promise<Product> {
    try {
      if (!newPrice) {
        throw new BadRequestException('Um preço novo é obrigatório');
      }

      if (newPrice <= 0) {
        throw new BadRequestException(
          'Por favor, adicione um valor válido para o produto',
        );
      }

      const productInDiscount =
        await this.productRepository.putProductInDiscount(productId, newPrice);

      if (!productInDiscount) {
        throw new NotFoundException('Produto não encontrado');
      }

      return productInDiscount;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeDiscountOfProduct(productId: string): Promise<Product> {
    try {
      const productWithoutDiscount =
        await this.productRepository.removeDiscountOfProduct(productId);

      if (!productWithoutDiscount) {
        throw new NotFoundException('Produto não encontrado');
      }

      return productWithoutDiscount;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllDiscountProducts(): Promise<Product[]> {
    try {
      const products = await this.productRepository.returnAllDiscountProducts();

      if (products.length === 0) {
        throw new HttpException(null, 204);
      }

      return products;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
