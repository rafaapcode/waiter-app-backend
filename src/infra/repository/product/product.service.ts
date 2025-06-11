import {
  CreateProductDto,
  UpdateProductDto,
} from '@core/http/product/dto/Input.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product, ProductType } from '@shared/types/Product.type';
import { Model, Schema } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(CONSTANTS.PRODUCT_PROVIDER)
    private productModel: Model<Product>,
  ) {}

  async createProduct(
    productData: CreateProductDto,
  ): Promise<ProductType<string, string>> {
    try {
      const product = await this.productModel.create(productData);
      const ingredients = product.ingredients.map((id) => id.toString());
      return {
        ...product,
        _id: product.id,
        ingredients,
        category: product.category.toString(),
      };
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

  async listProducts(): Promise<
    ProductType<
      {
        _id: string;
        name: string;
        icon: string;
      },
      {
        _id: string;
        name: string;
        icon: string;
      }
    >[]
  > {
    try {
      const products = await this.productModel
        .find()
        .populate('ingredients', '_id name icon')
        .populate('category', '_id name icon');
      return products.map((p) => {
        const cat = p.category as {
          _id: Schema.Types.ObjectId;
          name: string;
          icon: string;
        };
        const categorie = {
          ...cat,
          _id: cat._id.toString(),
        };

        const ingredients = p.ingredients.map((ing) => ({
          ...ing,
          _id: ing._id.toString(),
        }));

        return {
          ...p,
          _id: p._id.toString(),
          category: categorie,
          ingredients,
        };
      });
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

  async listProductsByCategorie(
    categoryId: string,
  ): Promise<ProductType<string, string>[]> {
    try {
      const products = await this.productModel
        .find()
        .where('category')
        .equals(categoryId);

      return products.map((p) => ({
        ...p,
        _id: p._id.toString(),
        category: p.category.toString(),
        ingredients: p.ingredients.map((id) => id.toString()),
      }));
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
    data: UpdateProductDto,
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

  async returnAllDiscountProducts(): Promise<ProductType<string, string>[]> {
    try {
      const products = await this.productModel.where('discount', true).find();
      return products.map((p) => ({
        ...p,
        _id: p._id.toString(),
        category: p.category.toString(),
        ingredients: p.ingredients.map((id) => id.toString()),
      }));
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

  async getProduct(productId: string): Promise<
    ProductType<
      {
        _id: string;
        name: string;
        icon: string;
      },
      {
        _id: string;
        name: string;
        icon: string;
      }
    >
  > {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate('ingredients', '_id name icon')
        .populate('category', '_id name icon');

      const cat = product.category as {
        _id: Schema.Types.ObjectId;
        name: string;
        icon: string;
      };
      const categorie = {
        ...cat,
        _id: cat._id.toString(),
      };

      const ingredients = product.ingredients.map((ing) => ({
        ...ing,
        _id: ing._id.toString(),
      }));

      return {
        ...product,
        _id: product._id.toString(),
        category: categorie,
        ingredients,
      };
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

  async categoryIsBeingUsed(categoryId: string): Promise<boolean> {
    const productWithCategory = await this.productModel.findOne({
      category: categoryId,
    });

    if (productWithCategory) {
      return true;
    }

    return false;
  }

  async deleteAllProductsOfOrg(orgId: string): Promise<boolean> {
    try {
      await this.productModel.deleteMany({
        org: orgId,
      });

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
