import { CategoryType } from '@shared/types/Category.type';
import { OrgType } from '@shared/types/Org.type';
import { Schema } from 'mongoose';
import { CreateCategoryDto, EditCategoryDto } from '../dto/Input.dto';
import {
  OutPutCreateCategoryDto,
  OutPutListCategoryDto,
} from '../dto/OutPut.dto';

export class CategoryEntity<TOrg = Schema.Types.ObjectId | OrgType> {
  constructor(
    public readonly name: string,
    public readonly icon: string,
    public readonly org: TOrg,
    public readonly _id?: string,
  ) {}

  static toUpdate(data: EditCategoryDto): EditCategoryDto {
    return {
      ...(data.name && { name: data.name }),
      ...(data.icon && { icon: data.icon }),
    };
  }

  static newCategory(data: CreateCategoryDto): CategoryEntity<string> {
    return new CategoryEntity(data.name, data.icon, data.org);
  }

  static toEntity(data: CategoryType<string>): CategoryEntity<string> {
    return new CategoryEntity(data.name, data.icon, data.org, data.id);
  }

  toCreate(): CreateCategoryDto {
    return {
      name: this.name,
      icon: this.icon,
      org: this.org as string,
    };
  }

  httpCreateResponse(): OutPutCreateCategoryDto {
    return {
      name: this.name,
      icon: this.icon,
      id: this._id,
    };
  }

  static httpListResponse(
    categories: CategoryEntity<string>[],
  ): OutPutListCategoryDto['categories'] {
    return categories.map((c) => ({
      id: c._id,
      icon: c.icon,
      name: c.name,
    }));
  }
}
