import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { CreateProductDTO } from 'src/product/dto/Product.dto';
import { Product } from 'src/types/Product.type';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(CONSTANTS.PRODUCT_PROVIDER)
    private productModel: Model<Product>,
  ) {}

  async crateProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const product = await this.productModel.create(productData);
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listProductsByCategorie(categoryId: string): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .where('category')
        .equals(categoryId);

      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
