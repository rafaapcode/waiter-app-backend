import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from 'src/types/Order.type';
import { CONSTANTS } from '../../../constants';
import { CreateProductDTO } from '../../../core/http/product/dto/Product.dto';
import { UpdateProductDTO } from '../../../core/http/product/dto/UpdateProduct.dto';
import { Product } from '../../../types/Product.type';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(CONSTANTS.PRODUCT_PROVIDER)
    private productModel: Model<Product>,
    @Inject(CONSTANTS.ORDER_PROVIDER)
    private orderModel: Model<Order>,
  ) {}

  async crateProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const product = await this.productModel.create(productData);
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

  async listProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .populate('ingredients', '_id name icon')
        .populate('category', '_id name icon');
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

  async listProductsByCategorie(categoryId: string): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .where('category')
        .equals(categoryId);

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

  async productExists(name: string): Promise<boolean> {
    try {
      const product = await this.productModel.findOne({ name });
      if (!product) {
        return false;
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

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const productIsBeingUsed = await this.orderModel.findOne({
        'products.product': productId,
        deletedAt: null,
      });

      if (productIsBeingUsed) {
        throw new BadRequestException(
          'Atualmente o produto está sendo usado em algum PEDIDO.',
        );
      }

      const productDeleted =
        await this.productModel.findByIdAndDelete(productId);

      if (!productDeleted) {
        return false;
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
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        productId,
        {
          ...data,
        },
        { new: true },
      );

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

  async putProductInDiscount(
    productId: string,
    discountPrice: number,
  ): Promise<Product> {
    try {
      const productInDiscount = await this.productModel.findByIdAndUpdate(
        productId,
        { discount: true, priceInDiscount: discountPrice },
        { new: true },
      );

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
      const productWithoutDiscount = await this.productModel.findByIdAndUpdate(
        productId,
        { discount: false, priceInDiscount: 0 },
        { new: true },
      );

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

  async returnAllDiscountProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.where('discount', true).find();
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

  async getProduct(productId: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate('ingredients', '_id name icon')
        .populate('category', '_id name icon');

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

  async allProductsExists(productsIds: string[]): Promise<Product[]> {
    const allProductsExists = await this.productModel.find({
      _id: { $in: productsIds },
    });
    if (!allProductsExists) {
      throw new NotFoundException('Um ou mais produtos não existe');
    }
    return allProductsExists;
  }
}
