import { CreateOrgDTO, UpdateOrgDTO } from '@core/http/org/dto/Input.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Org, OrgType } from '@shared/types/Org.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class OrgRepository {
  constructor(
    @Inject(CONSTANTS.ORG_PROVIDER)
    private orgModel: Model<Org>,
  ) {}

  async createOrg(org: CreateOrgDTO): Promise<OrgType> {
    const newOrg = await this.orgModel.create(org);
    return {
      description: newOrg.description,
      email: newOrg.email,
      imageUrl: newOrg.imageUrl,
      cep: newOrg.cep,
      city: newOrg.city,
      closeHour: newOrg.closeHour,
      location: newOrg.location,
      neighborhood: newOrg.neighborhood,
      openHour: newOrg.openHour,
      street: newOrg.street,
      name: newOrg.name,
      user: newOrg.user.toString(),
      _id: newOrg.id,
    };
  }

  async updateOrg(orgId: string, org: UpdateOrgDTO): Promise<OrgType> {
    const newOrg = await this.orgModel.findByIdAndUpdate(
      orgId,
      { ...org },
      { new: true },
    );

    if (!newOrg) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      description: newOrg.description,
      email: newOrg.email,
      imageUrl: newOrg.imageUrl,
      cep: newOrg.cep,
      city: newOrg.city,
      closeHour: newOrg.closeHour,
      location: newOrg.location,
      neighborhood: newOrg.neighborhood,
      openHour: newOrg.openHour,
      street: newOrg.street,
      name: newOrg.name,
      user: newOrg.user.toString(),
      _id: newOrg.id,
    };
  }

  async getOrgById(orgId: string): Promise<OrgType> {
    const orgById = await this.orgModel.findById(orgId);

    if (!orgById) {
      throw new NotFoundException('Organização não encontrada');
    }
    return {
      description: orgById.description,
      email: orgById.email,
      imageUrl: orgById.imageUrl,
      cep: orgById.cep,
      city: orgById.city,
      closeHour: orgById.closeHour,
      location: orgById.location,
      neighborhood: orgById.neighborhood,
      openHour: orgById.openHour,
      street: orgById.street,
      name: orgById.name,
      user: orgById.user.toString(),
      _id: orgById.id,
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
        description: org.description,
        email: org.email,
        imageUrl: org.imageUrl,
        cep: org.cep,
        city: org.city,
        closeHour: org.closeHour,
        location: org.location,
        neighborhood: org.neighborhood,
        openHour: org.openHour,
        street: org.street,
        name: org.name,
        user: org.user.toString(),
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
