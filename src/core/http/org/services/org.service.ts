import { CategoryRepository } from '@infra/repository/category/category.repository';
import { OrderRepository } from '@infra/repository/order/order.repository';
import { OrgRepository } from '@infra/repository/org/org.repository';
import { ProductRepository } from '@infra/repository/product/product.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { env } from '@shared/config/env';
import mongoose from 'mongoose';
import { UpdateOrgDTO } from '../dto/Input.dto';
import { OrgEntity } from '../entity/org.entity';
import { VerifyOrgOwnershipService } from './verifyOrgOwnership.service';

@Injectable()
export class OrgService {
  constructor(
    private readonly orgRepository: OrgRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly orderRepository: OrderRepository,
    private readonly verifyOwnershipService: VerifyOrgOwnershipService,
    private readonly productRepository: ProductRepository,
  ) {}

  async createOrg(orgData: OrgEntity): Promise<OrgEntity> {
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

  async updateOrg(
    userid: string,
    orgId: string,
    orgData: UpdateOrgDTO,
  ): Promise<OrgEntity> {
    await this.verifyOwnershipService.verify(userid, orgId);

    const orgExists = await this.orgRepository.getOrgById(orgId);

    if (!orgExists) {
      throw new NotFoundException('Organização não encontrada');
    }

    const org = await this.orgRepository.updateOrg(orgId, orgData);

    return org;
  }

  async deleteOrg(userid: string, orgId: string): Promise<boolean> {
    await this.verifyOwnershipService.verify(userid, orgId);

    const orgExists = await this.orgRepository.getOrgById(orgId);
    if (!orgExists) {
      throw new NotFoundException('Organização não encontrada');
    }
    const session = await mongoose.startSession();
    try {
      let productUrlsToDelete = [];
      let orgKeyPath = '';
      await session.withTransaction(async () => {
        const deleteCategory =
          this.categoryRepository.deleteAllCategoryOfOrg(orgId);
        const deleteOrder = this.orderRepository.deleteAllOrdersOfOrg(orgId);
        const deleteProduct =
          this.productRepository.deleteAllProductsOfOrg(orgId);

        const [, , productUrls] = await Promise.all([
          deleteCategory,
          deleteOrder,
          deleteProduct,
        ]);
        productUrlsToDelete = productUrls.map((url) =>
          new URL(url).pathname.slice(1),
        );
        await this.orgRepository.deleteOrgById(orgId);
        orgKeyPath = '';
      });
      await session.commitTransaction();

      fetch(`${env.IMAGE_URL}/delete/batch`, {
        method: 'POST',
        body: JSON.stringify({ keys: productUrlsToDelete }),
      }).catch((err) => {
        console.error(err);
        console.log('Erro ao deletar as imagems dos produtos');
      });

      fetch(`${env.IMAGE_URL}?key_path=${orgKeyPath}`, {
        method: 'POST',
        body: JSON.stringify({ keys: productUrlsToDelete }),
      }).catch((err) => {
        console.error(err);
        console.log('Erro ao deletar as imagems dos produtos');
      });

      return true;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      return false;
    }
  }

  async getOrgId(userid: string, orgId: string): Promise<OrgEntity> {
    await this.verifyOwnershipService.verify(userid, orgId);
    return await this.orgRepository.getOrgById(orgId);
  }

  async getAllOrgsOfUser(userid: string): Promise<OrgEntity[]> {
    return await this.orgRepository.getAllOrgsOfUser(userid);
  }
}
