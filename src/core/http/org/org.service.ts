import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from 'src/infra/repository/category/category.service';
import { OrderRepository } from 'src/infra/repository/order/order.service';
import { OrgRepository } from 'src/infra/repository/org/org.service';
import { ProductRepository } from 'src/infra/repository/product/product.service';
import { OrgType } from 'src/shared/types/Org.type';
import { CreateOrgDTO, UpdateOrgDTO } from './dto/Input.dto';

@Injectable()
export class OrgService {
  constructor(
    private readonly orgRepository: OrgRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createOrg(orgData: CreateOrgDTO): Promise<OrgType> {
    const orgExists = await this.orgRepository.getOrgByName(
      orgData.name,
      orgData.user,
    );

    if (orgExists) {
      throw new BadRequestException('Organização já existe');
    }

    const org = await this.orgRepository.createOrg(orgData);

    return org;
  }

  async updateOrg(orgId: string, orgData: UpdateOrgDTO): Promise<OrgType> {
    const orgExists = await this.orgRepository.getOrgById(orgId);

    if (!orgExists) {
      throw new NotFoundException('Organização não encontrada');
    }

    const org = await this.orgRepository.updateOrg(orgId, orgData);

    return org;
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
    return await this.orgRepository.getOrgById(orgId);
  }

  async getAllOrgsOfUser(userid: string): Promise<OrgType[]> {
    return await this.orgRepository.getAllOrgsOfUser(userid);
  }
}
