import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from 'src/repository/product/product.service';
import { Product, ProductType } from 'src/types/Product.type';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(productData: ProductType): Promise<Product> {
    try {
      const product = await this.productRepository.crateProduct(productData);

      if (!product) {
        throw new InternalServerErrorException('Erro ao criar o produto');
      }

      return product;
    } catch (error) {
      console.log(error);
      return null;
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
      console.log(error);
      return null;
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
      console.log(error);
      return null;
    }
  }
}
