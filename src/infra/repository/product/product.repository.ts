import {
  CreateProductDto,
  UpdateProductDto,
} from '@core/http/product/dto/Input.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ListProductsType,
  Product,
  ProductType,
} from '@shared/types/Product.type';
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

  async listProducts(orgId: string): Promise<ListProductsType[]> {
    const products = await this.productModel
      .find({ org: orgId })
      .populate('ingredients', '_id name icon')
      .populate('category', '_id name icon');

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

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

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado nessa categoria');
    }

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
  ): Promise<ProductType<string, string>> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        ...data,
      },
      { new: true },
    );

    return {
      _id: updatedProduct.id,
      category: updatedProduct.category.toString(),
      description: updatedProduct.description,
      discount: updatedProduct.discount,
      imageUrl: updatedProduct.imageUrl,
      ingredients: updatedProduct.ingredients.map((ing) => ing.toString()),
      name: updatedProduct.name,
      price: updatedProduct.price,
      priceInDiscount: updatedProduct.priceInDiscount,
    };
  }

  async putProductInDiscount(
    productId: string,
    discountPrice: number,
  ): Promise<ProductType<string, string>> {
    const productInDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: true, priceInDiscount: discountPrice },
      { new: true },
    );

    return {
      _id: productInDiscount.id,
      category: productInDiscount.category.toString(),
      description: productInDiscount.description,
      discount: productInDiscount.discount,
      imageUrl: productInDiscount.imageUrl,
      ingredients: productInDiscount.ingredients.map((ing) => ing.toString()),
      name: productInDiscount.name,
      price: productInDiscount.price,
      priceInDiscount: productInDiscount.priceInDiscount,
    };
  }

  async removeDiscountOfProduct(
    productId: string,
  ): Promise<ProductType<string, string>> {
    const productWithoutDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: false, priceInDiscount: 0 },
      { new: true },
    );

    return {
      _id: productWithoutDiscount.id,
      category: productWithoutDiscount.category.toString(),
      description: productWithoutDiscount.description,
      discount: productWithoutDiscount.discount,
      imageUrl: productWithoutDiscount.imageUrl,
      ingredients: productWithoutDiscount.ingredients.map((ing) =>
        ing.toString(),
      ),
      name: productWithoutDiscount.name,
      price: productWithoutDiscount.price,
      priceInDiscount: productWithoutDiscount.priceInDiscount,
    };
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

  async getProduct(productId: string): Promise<ListProductsType> {
    const product = await this.productModel
      .findById(productId)
      .populate('ingredients', '_id name icon')
      .populate('category', '_id name icon');

    if (!product) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    const cat = product.category as {
      _id: Schema.Types.ObjectId;
      name: string;
      icon: string;
    };
    const categorie = {
      _id: cat._id.toString(),
      name: cat.name,
      icon: cat.icon,
    };

    const ingredients = product.ingredients.map((ing) => ({
      _id: ing._id.toString(),
      name: ing.name,
      icon: ing.icon,
    }));

    return {
      _id: product._id.toString(),
      category: categorie,
      ingredients,
      description: product.description,
      discount: product.discount,
      imageUrl: product.imageUrl,
      price: product.price,
      name: product.name,
      priceInDiscount: product.priceInDiscount,
    };
  }

  async allProductsExists(
    productsIds: string[],
  ): Promise<ProductType<string, string>[]> {
    const allProductsExists = await this.productModel.find({
      _id: { $in: productsIds },
    });
    if (!allProductsExists) {
      throw new NotFoundException('Um ou mais produtos não existe');
    }
    return allProductsExists.map((p) => {
      return {
        _id: p.id,
        category: p.category.toString(),
        description: p.description,
        discount: p.discount,
        imageUrl: p.imageUrl,
        ingredients: p.ingredients.map((ing) => ing.toString()),
        name: p.name,
        price: p.price,
        priceInDiscount: p.priceInDiscount,
      };
    });
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

  async verifyProductOwnership(
    orgId: string,
    productId: string,
  ): Promise<boolean> {
    await this.productModel.findOne({
      org: orgId,
      _id: productId,
    });

    return true;
  }
}
