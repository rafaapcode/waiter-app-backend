import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from 'src/repository/product/product.service';
import { Product } from 'src/types/Product.type';
import { validateSchema } from 'src/utils/validateSchema';
import { CreateProductDTO, createProductSchema } from './dto/Product.dto';

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

      return products;
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

  async listProductByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products =
        await this.productRepository.listProductsByCategorie(categoryId);
      if (!products) {
        throw new NotFoundException(
          'Nenhum produto encontrado nessa categoria',
        );
      }

      return products;
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
}
