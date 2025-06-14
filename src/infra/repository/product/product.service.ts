import {
  CreateProductDto,
  UpdateProductDto,
} from '@core/http/product/dto/Input.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    const product = await this.productModel.create(productData);
    const ingredients = product.ingredients.map((id) => id.toString());
    return {
      _id: product.id,
      ingredients,
      category: product.category.toString(),
      description: product.description,
      discount: product.discount,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      priceInDiscount: product.priceInDiscount,
    };
  }

  async listProducts(orgId: string): Promise<
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
    const products = await this.productModel
      .find({ org: orgId })
      .populate('ingredients', '_id name icon')
      .populate('category', '_id name icon');

    return products.map((p) => {
      const cat = p.category as {
        _id: Schema.Types.ObjectId;
        name: string;
        icon: string;
      };
      const categorie = {
        _id: cat._id.toString(),
        name: cat.name,
        icon: cat.icon,
      };

      const ingredients = p.ingredients.map((ing) => ({
        _id: ing._id.toString(),
        name: ing.name,
        icon: ing.icon,
      }));

      return {
        _id: p._id.toString(),
        category: categorie,
        ingredients,
        description: p.description,
        discount: p.discount,
        imageUrl: p.imageUrl,
        name: p.name,
        price: p.price,
        priceInDiscount: p.priceInDiscount,
      };
    });
  }

  async listProductsByCategorie(
    orgId: string,
    categoryId: string,
  ): Promise<ProductType<string, string>[]> {
    const products = await this.productModel.find({
      org: orgId,
      category: categoryId,
    });

    return products.map((p) => ({
      _id: p._id.toString(),
      category: p.category.toString(),
      ingredients: p.ingredients.map((id) => id.toString()),
      description: p.description,
      discount: p.discount,
      imageUrl: p.imageUrl,
      name: p.name,
      price: p.price,
      priceInDiscount: p.priceInDiscount,
    }));
  }

  async productExists(name: string, orgId: string): Promise<boolean> {
    const product = await this.productModel.findOne({ name, org: orgId });
    if (!product) {
      return false;
    }
    return true;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const productDeleted = await this.productModel.findByIdAndDelete(productId);

    if (!productDeleted) {
      return false;
    }
    return true;
  }

  async updateProduct(
    productId: string,
    data: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        ...data,
      },
      { new: true },
    );

    return updatedProduct;
  }

  async putProductInDiscount(
    productId: string,
    discountPrice: number,
  ): Promise<Product> {
    const productInDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: true, priceInDiscount: discountPrice },
      { new: true },
    );

    return productInDiscount;
  }

  async removeDiscountOfProduct(productId: string): Promise<Product> {
    const productWithoutDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: false, priceInDiscount: 0 },
      { new: true },
    );

    return productWithoutDiscount;
  }

  async returnAllDiscountProducts(
    orgId: string,
  ): Promise<ProductType<string, string>[]> {
    const products = await this.productModel.find({
      discount: true,
      org: orgId,
    });
    return products.map((p) => ({
      _id: p._id.toString(),
      category: p.category.toString(),
      ingredients: p.ingredients.map((id) => id.toString()),
      description: p.description,
      discount: p.discount,
      imageUrl: p.imageUrl,
      name: p.name,
      price: p.price,
      priceInDiscount: p.priceInDiscount,
    }));
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

  async categoryIsBeingUsed(
    categoryId: string,
    orgId: string,
  ): Promise<boolean> {
    const productWithCategory = await this.productModel.findOne({
      category: categoryId,
      org: orgId,
    });

    if (productWithCategory) {
      return true;
    }

    return false;
  }

  async deleteAllProductsOfOrg(orgId: string): Promise<boolean> {
    await this.productModel.deleteMany({
      org: orgId,
    });

    return true;
  }
}
