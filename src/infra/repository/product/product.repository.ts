import { UpdateProductDto } from '@core/http/product/dto/Input.dto';
import { ProductEntity } from '@core/http/product/entity/Product.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ListProductEntityType,
  Product,
  ProductType,
} from '@shared/types/Product.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(CONSTANTS.PRODUCT_PROVIDER)
    private productModel: Model<Product>,
  ) {}

  async createProduct(
    productData: ProductEntity<string, string[], string>,
  ): Promise<ProductEntity<string, string[], string>> {
    const product = await this.productModel.create(productData.toCreate());
    const ingredients = product.ingredients.map((id) => id.toString());
    return ProductEntity.toEntity({
      _id: product.id,
      category: product.category.toString(),
      description: product.description,
      discount: product.discount,
      ingredients,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      priceInDiscount: product.priceInDiscount,
    });
  }

  async listProducts(orgId: string): Promise<ListProductEntityType[]> {
    const products = await this.productModel
      .find({ org: orgId })
      .populate('ingredients', '_id name icon')
      .populate('category', '_id name icon');

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    return products.map((p) => {
      return ProductEntity.toEntityPopulated(p);
    });
  }

  async listProductsByCategorie(
    orgId: string,
    categoryId: string,
  ): Promise<ProductEntity<string, string[], string>[]> {
    const products = await this.productModel.find({
      org: orgId,
      category: categoryId,
    });

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado nessa categoria');
    }

    return products.map((p) =>
      ProductEntity.toEntity({
        _id: p.id,
        category: p.category.toString(),
        description: p.description,
        discount: p.discount,
        ingredients: p.ingredients.map((id) => id.toString()),
        imageUrl: p.imageUrl,
        name: p.name,
        price: p.price,
        priceInDiscount: p.priceInDiscount,
      }),
    );
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
  ): Promise<ProductEntity<string, string[], string>> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        ...data,
      },
      { new: true },
    );
    return ProductEntity.toEntity({
      _id: updatedProduct.id,
      category: updatedProduct.category.toString(),
      description: updatedProduct.description,
      discount: updatedProduct.discount,
      ingredients: updatedProduct.ingredients.map((ing) => ing.toString()),
      imageUrl: updatedProduct.imageUrl,
      name: updatedProduct.name,
      price: updatedProduct.price,
      priceInDiscount: updatedProduct.priceInDiscount,
    });
  }

  async putProductInDiscount(
    productId: string,
    discountPrice: number,
  ): Promise<ProductEntity<string, string[], string>> {
    const productInDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: true, priceInDiscount: discountPrice },
      { new: true },
    );

    return ProductEntity.toEntity({
      _id: productInDiscount.id,
      category: productInDiscount.category.toString(),
      description: productInDiscount.description,
      discount: productInDiscount.discount,
      ingredients: productInDiscount.ingredients.map((ing) => ing.toString()),
      imageUrl: productInDiscount.imageUrl,
      name: productInDiscount.name,
      price: productInDiscount.price,
      priceInDiscount: productInDiscount.priceInDiscount,
    });
  }

  async removeDiscountOfProduct(
    productId: string,
  ): Promise<ProductEntity<string, string[], string>> {
    const productWithoutDiscount = await this.productModel.findByIdAndUpdate(
      productId,
      { discount: false, priceInDiscount: 0 },
      { new: true },
    );

    return ProductEntity.toEntity({
      _id: productWithoutDiscount.id,
      category: productWithoutDiscount.category.toString(),
      description: productWithoutDiscount.description,
      discount: productWithoutDiscount.discount,
      ingredients: productWithoutDiscount.ingredients.map((ing) =>
        ing.toString(),
      ),
      imageUrl: productWithoutDiscount.imageUrl,
      name: productWithoutDiscount.name,
      price: productWithoutDiscount.price,
      priceInDiscount: productWithoutDiscount.priceInDiscount,
    });
  }

  async returnAllDiscountProducts(
    orgId: string,
  ): Promise<ProductEntity<string, string[], string>[]> {
    const products = await this.productModel.find({
      discount: true,
      org: orgId,
    });

    return products.map((p) =>
      ProductEntity.toEntity({
        _id: p.id,
        category: p.category.toString(),
        description: p.description,
        discount: p.discount,
        ingredients: p.ingredients.map((id) => id.toString()),
        imageUrl: p.imageUrl,
        name: p.name,
        price: p.price,
        priceInDiscount: p.priceInDiscount,
      }),
    );
  }

  async getProduct(productId: string): Promise<ListProductEntityType> {
    const product = await this.productModel
      .findById(productId)
      .populate('ingredients', '_id name icon')
      .populate('category', '_id name icon');

    if (!product) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    return ProductEntity.toEntityPopulated(product);
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
    return allProductsExists.map((p) => ({
      _id: p.id,
      category: p.category.toString(),
      description: p.description,
      discount: p.discount,
      ingredients: p.ingredients.map((id) => id.toString()),
      imageUrl: p.imageUrl,
      name: p.name,
      price: p.price,
      priceInDiscount: p.priceInDiscount,
    }));
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
