import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  }

  async updateOrg(orgId: string, org: UpdateOrgDto): Promise<OrgType> {
    const newOrg = await this.orgModel.findByIdAndUpdate(
      orgId,
      { ...org },
      { new: true },
    );

    if (!newOrg) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      descricao: newOrg.descricao,
      email: newOrg.email,
      imageUrl: newOrg.imageUrl,
      info: newOrg.info,
      name: newOrg.name,
      user: newOrg.user,
      _id: newOrg.id,
    };
  }

  async getOrgById(orgId: string): Promise<OrgType> {
    const orgById = await this.orgModel.findById(orgId);

    if (!orgById) {
      throw new NotFoundException('Organização não encontrada');
    }

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
  }

  async getOrgByName(orgName: string, userid: string): Promise<boolean> {
    const orgByName = await this.orgModel.findOne({
      name: orgName,
      user: userid,
    });
    if (orgByName) {
      return true;
    }
    return false;
  }

  async getAllOrgsOfUser(userId: string): Promise<OrgType[]> {
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
  }

  async deleteOrgById(orgId: string): Promise<boolean> {
    await this.orgModel.deleteOne({
      _id: orgId,
    });

    return true;
  }
}
