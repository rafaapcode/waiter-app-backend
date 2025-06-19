import { Category } from '@shared/types/Category.type';
import { Ingredient } from '@shared/types/Ingredient.type';
import { Org } from '@shared/types/Org.type';
import {
  CategoriePropertie,
  IngredientsProperties,
  ListProductEntityType,
  OrgPropertie,
  Product,
  ProductType,
} from '@shared/types/Product.type';
import { Document, Schema } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from '../dto/Input.dto';
import {
  OutPutCreateProductDto,
  OutPutDiscountProductDto,
  OutPutGetProductDto,
  OutPutListProductByCategorieDto,
  OutPutListProductDto,
} from '../dto/OutPut.dto';

type ProductMongoType = Document<
  unknown,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  Product<CategoriePropertie, OrgPropertie, IngredientsProperties>
> &
  Product<CategoriePropertie, OrgPropertie, IngredientsProperties> &
  Required<{
    _id: unknown;
  }> & {
    __v: number;
  };

type IngredientType = {
  _id: string;
  name: string;
  icon: string;
};

type CategoryType = {
  _id: string;
  name: string;
  icon: string;
};

export class ProductEntity<
  TCat = Schema.Types.ObjectId | Category,
  TIng = Schema.Types.ObjectId | Ingredient,
  TOrg = Schema.Types.ObjectId | Org,
> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly price: number,
    public readonly ingredients: TIng,
    public readonly category: TCat,
    public readonly discount: boolean,
    public readonly priceInDiscount: number,
    public readonly org?: TOrg,
    public readonly _id?: string,
  ) {}

  static newProduct(
    data: CreateProductDto,
  ): ProductEntity<string, string[], string> {
    return new ProductEntity(
      data.name,
      data.description,
      data.imageUrl ||
        'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
      data.price,
      data.ingredients,
      data.category,
      false,
      0,
      data.org,
    );
  }

  static toEntity(
    data: ProductType<string, string>,
  ): ProductEntity<string, string[], string> {
    return new ProductEntity(
      data.name,
      data.description,
      data.imageUrl,
      data.price,
      data.ingredients,
      data.category,
      false,
      0,
      undefined,
      data._id,
    );
  }

  static toEntityPopulated(data: ProductMongoType): ProductEntity<
    {
      _id: string;
      name: string;
      icon: string;
    },
    {
      _id: string;
      name: string;
      icon: string;
    }[],
    OrgPropertie
  > {
    const cat = data.category as {
      _id: Schema.Types.ObjectId;
      name: string;
      icon: string;
    };
    const categorie = {
      _id: cat._id.toString(),
      name: cat.name,
      icon: cat.icon,
    };
    const ingredients = data.ingredients.map((ing) => ({
      _id: ing._id.toString(),
      name: ing.name,
      icon: ing.icon,
    }));

    return new ProductEntity(
      data.name,
      data.description,
      data.imageUrl,
      data.price,
      ingredients,
      categorie,
      false,
      0,
      undefined,
      data._id.toString(),
    );
  }

  static toUpdate(data: UpdateProductDto): UpdateProductDto {
    return {
      ...(data.name && { name: data.name }),
      ...(data.category && { category: data.category }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.description && { description: data.description }),
      ...(data.discount ? { discount: data.discount } : { discount: false }),
      ...(data.ingredients && { ingredients: data.ingredients }),
      ...(data.org && { org: data.org }),
      ...(data.price && { price: data.price }),
      ...(data.priceInDiscount && { priceInDiscount: data.priceInDiscount }),
    };
  }

  toCreate(): CreateProductDto {
    return {
      category: this.category as string,
      description: this.description,
      imageUrl: this.imageUrl,
      ingredients: this.ingredients as string[],
      name: this.name,
      org: this.org as string,
      price: this.price,
    };
  }

  static httpListProductsResponse(
    products: ListProductEntityType[],
  ): OutPutListProductDto {
    return {
      products: products.map((p) => ({
        _id: p._id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        price: p.price,
        category: p.category,
        discount: p.discount,
        priceInDiscount: p.priceInDiscount,
        ingredients: p.ingredients,
      })),
    };
  }

  httpGetProductsResponse(): OutPutGetProductDto {
    return {
      _id: this._id,
      category: this.category as CategoryType,
      description: this.description,
      discount: this.discount,
      imageUrl: this.imageUrl,
      ingredients: this.ingredients as IngredientType[],
      name: this.name,
      price: this.price,
      priceInDiscount: this.priceInDiscount,
    };
  }

  httpCreateProductsResponse(): OutPutCreateProductDto {
    return {
      _id: this._id,
      category: this.category as string,
      description: this.description,
      discount: this.discount,
      imageUrl: this.imageUrl,
      ingredients: this.ingredients as string[],
      name: this.name,
      price: this.price,
      priceInDiscount: this.priceInDiscount,
    };
  }

  static httpListProductsByCategorieResponse(
    products: ProductEntity<string, string[], string>[],
  ): OutPutListProductByCategorieDto {
    return {
      products: products.map((product) => ({
        _id: product._id,
        category: product.category as string,
        description: product.description,
        discount: product.discount,
        imageUrl: product.imageUrl,
        ingredients: product.ingredients as string[],
        name: product.name,
        price: product.price,
        priceInDiscount: product.priceInDiscount,
      })),
    };
  }

  static httpGetDiscountProductsResponse(
    products: ProductEntity<string, string[], string>[],
  ): OutPutDiscountProductDto {
    return {
      products: products.map((product) => ({
        _id: product._id,
        category: product.category as string,
        description: product.description,
        discount: product.discount,
        imageUrl: product.imageUrl,
        ingredients: product.ingredients as string[],
        name: product.name,
        price: product.price,
        priceInDiscount: product.priceInDiscount,
      })),
    };
  }
}
