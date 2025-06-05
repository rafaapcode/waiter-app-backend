import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from 'src/infra/repository/category/category.service';
import { OrderRepository } from 'src/infra/repository/order/order.service';
import { OrgRepository } from 'src/infra/repository/org/org.service';
import { ProductRepository } from 'src/infra/repository/product/product.service';
import { OrgType } from 'src/types/Org.type';
import { validateSchema } from 'src/utils/validateSchema';
import { CreateOrgDto, createOrgSchema } from './dto/createOrg.dto';
import { UpdateOrgDto, updateOrgSchema } from './dto/updateOrg.dto';

@Injectable()
export class OrgService {
  constructor(
    private readonly orgRepository: OrgRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createOrg(orgData: CreateOrgDto): Promise<OrgType> {
    const validateData = validateSchema(createOrgSchema, orgData);
    if (!validateData.success) {
      throw new BadRequestException(validateData.error.errors);
    }

    const orgExists = await this.orgRepository.getOrgByName(orgData.name);

    if (orgExists) {
      throw new BadRequestException('Organização já existe');
    }

    const org = await this.orgRepository.createOrg(orgData);

    return org;
  }

  async updateOrg(orgId: string, orgData: UpdateOrgDto): Promise<OrgType> {
    try {
      const validateData = validateSchema(updateOrgSchema, orgData);
      if (!validateData.success) {
        throw new BadRequestException(validateData.error.errors);
      }

      const orgExists = await this.orgRepository.getOrgById(orgId);

      if (!orgExists) {
        throw new NotFoundException('Organização não encontrada');
      }

      const org = await this.orgRepository.updateOrg(orgId, orgData);

      return org;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOrg(orgId: string): Promise<boolean> {
    const orgExists = await this.orgRepository.getOrgById(orgId);

    if (!orgExists) {
      throw new NotFoundException('Organização não encontrada');
    }

    const deleteCategory =
      this.categoryRepository.deleteAllCategoryOfOrg(orgId);
    const deleteOrder = this.orderRepository.deleteAllOrdersOfOrg(orgId);
    const deleteProduct = this.productRepository.deleteAllProductsOfOrg(orgId);

    await Promise.all([deleteCategory, deleteOrder, deleteProduct]);
    await this.orgRepository.deleteOrgById(orgId);

    return true;
  }

  async getOrgId(orgId: string): Promise<OrgType> {
    try {
      return await this.orgRepository.getOrgById(orgId);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllOrgsOfUser(userid: string): Promise<OrgType[]> {
    try {
      return await this.orgRepository.getAllOrgsOfUser(userid);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
