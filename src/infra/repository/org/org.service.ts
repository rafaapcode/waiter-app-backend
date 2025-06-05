import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateOrgDto } from 'src/core/http/org/dto/createOrg.dto';
import { UpdateOrgDto } from 'src/core/http/org/dto/updateOrg.dto';
import { Org, OrgType } from 'src/types/Org.type';
import { User } from 'src/types/User.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class OrgRepository {
  constructor(
    @Inject(CONSTANTS.ORG_PROVIDER)
    private orgModel: Model<Org>,
  ) {}

  async createOrg(org: CreateOrgDto): Promise<OrgType> {
    try {
      const newOrg = await this.orgModel.create(org);
      return {
        descricao: newOrg.descricao,
        email: newOrg.email,
        imageUrl: newOrg.imageUrl,
        info: newOrg.info,
        name: newOrg.name,
        user: newOrg.user,
        _id: newOrg.id,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao criar uma nova organização',
      );
    }
  }

  async updateOrg(orgId: string, org: UpdateOrgDto): Promise<OrgType> {
    try {
      const newOrg = await this.orgModel.findByIdAndUpdate(
        orgId,
        { ...org },
        { new: true },
      );
      return {
        descricao: newOrg.descricao,
        email: newOrg.email,
        imageUrl: newOrg.imageUrl,
        info: newOrg.info,
        name: newOrg.name,
        user: newOrg.user,
        _id: newOrg.id,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao criar uma nova organização',
      );
    }
  }

  async getOrgById(orgId: string): Promise<OrgType> {
    try {
      const orgById = await this.orgModel.findById(orgId);
      const orgPopulatedWithUser = await orgById.populate('user', 'name email');
      return {
        descricao: orgPopulatedWithUser.descricao,
        email: orgPopulatedWithUser.email,
        imageUrl: orgPopulatedWithUser.imageUrl,
        info: orgPopulatedWithUser.info,
        name: orgPopulatedWithUser.name,
        user: orgPopulatedWithUser.user as User,
        _id: orgPopulatedWithUser.id,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao criar uma nova organização',
      );
    }
  }

  async getOrgByName(orgName: string): Promise<boolean> {
    try {
      const orgByName = await this.orgModel.findOne({ name: orgName });
      if (orgByName) {
        return true;
      }
      return false;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao criar uma nova organização',
      );
    }
  }

  async getAllOrgsOfUser(userId: string): Promise<OrgType[]> {
    try {
      const allOrgs = await this.orgModel.find({
        user: userId,
      });

      return allOrgs.map((org) => {
        return {
          descricao: org.descricao,
          email: org.email,
          imageUrl: org.imageUrl,
          info: org.info,
          name: org.name,
          user: org.user,
          _id: org.id,
        };
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao criar uma nova organização',
      );
    }
  }

  async deleteOrgById(orgId: string): Promise<boolean> {
    try {
      await this.orgModel.deleteOne({
        id: orgId,
      });

      return true;
    } catch {
      throw new InternalServerErrorException('Erro ao deletear a organização');
    }
  }
}
