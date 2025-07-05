import { OrgType } from '@shared/types/Org.type';
import { CreateOrgDTO, UpdateOrgDTO } from '../dto/Input.dto';
import {
  OutPutCreateOrgDto,
  OutPutGetOrgDto,
  OutPutListOrgsInfoOfUser,
  OutPutListOrgsOfUser,
  OutPutUpdateOrgDto,
} from '../dto/OutPut.dto';

export class OrgEntity {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly imageUrl: string,
    public readonly description: string,
    public readonly locationCode: string,
    public readonly openHour: string,
    public readonly closeHour: string,
    public readonly cep: string,
    public readonly city: string,
    public readonly neighborhood: string,
    public readonly street: string,
    public readonly user: string,
    public readonly location: {
      type?: 'Point';
      coordinates?: [number, number];
    },
    public readonly _id?: string,
  ) {}

  static newOrg(data: CreateOrgDTO & { user: string }): OrgEntity {
    return new OrgEntity(
      data.name,
      data.email,
      data.imageUrl,
      data.description,
      data.locationCode,
      data.openHour,
      data.closeHour,
      data.cep,
      data.city,
      data.neighborhood,
      data.street,
      data.user,
      {
        type: 'Point',
        coordinates: [
          data.location ? data.location[0] : 0,
          data.location ? data.location[1] : 0,
        ],
      },
    );
  }

  static toEntity(data: OrgType): OrgEntity {
    return new OrgEntity(
      data.name,
      data.email,
      data.imageUrl,
      data.description,
      data.locationCode,
      data.openHour,
      data.closeHour,
      data.cep,
      data.city,
      data.neighborhood,
      data.street,
      data.user,
      data.location,
      data._id,
    );
  }

  static toUpdate(data: UpdateOrgDTO): UpdateOrgDTO {
    return {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.locationCode && { location: data.locationCode }),
      ...(data.description && { description: data.description }),
      ...(data.openHour && { openHour: data.openHour }),
      ...(data.closeHour && { closeHour: data.closeHour }),
      ...(data.cep && { cep: data.cep }),
      ...(data.city && { city: data.city }),
      ...(data.neighborhood && { neighborhood: data.neighborhood }),
      ...(data.street && { street: data.street }),
      ...(data.location && { location: data.location }),
    };
  }

  toCreate(): CreateOrgDTO & { user: string } {
    return {
      locationCode: this.locationCode,
      cep: this.cep,
      city: this.city,
      closeHour: this.closeHour,
      description: this.description,
      email: this.email,
      imageUrl: this.imageUrl,
      name: this.name,
      neighborhood: this.neighborhood,
      openHour: this.openHour,
      street: this.street,
      user: this.user,
      ...(this.location.coordinates && { location: this.location.coordinates }),
    };
  }

  httpCreateResponse(): OutPutCreateOrgDto {
    return {
      _id: this._id,
      cep: this.cep,
      city: this.city,
      closeHour: this.closeHour,
      description: this.description,
      locationCode: this.locationCode,
      email: this.email,
      imageUrl: this.imageUrl,
      name: this.name,
      neighborhood: this.neighborhood,
      openHour: this.openHour,
      street: this.street,
      user: this.user,
      location: {
        type: 'Point',
        ...(this.location.coordinates && {
          coordinates: this.location.coordinates,
        }),
      },
    };
  }

  httpUpdateResponse(): OutPutUpdateOrgDto {
    return {
      cep: this.cep,
      city: this.city,
      closeHour: this.closeHour,
      description: this.description,
      email: this.email,
      imageUrl: this.imageUrl,
      name: this.name,
      neighborhood: this.neighborhood,
      openHour: this.openHour,
      street: this.street,
      user: this.user,
      location: {
        type: 'Point',
        ...(this.location.coordinates && {
          coordinates: this.location.coordinates,
        }),
      },
    };
  }

  httpGetOrgResponse(): OutPutGetOrgDto {
    return {
      cep: this.cep,
      city: this.city,
      closeHour: this.closeHour,
      description: this.description,
      email: this.email,
      imageUrl: this.imageUrl,
      name: this.name,
      neighborhood: this.neighborhood,
      openHour: this.openHour,
      street: this.street,
      locationCode: this.locationCode,
      user: this.user,
      location: {
        type: 'Point',
        ...(this.location.coordinates && {
          coordinates: this.location.coordinates,
        }),
      },
    };
  }

  static httpGetAllOrgsInfoResponse(
    orgs: OrgEntity[],
  ): OutPutListOrgsInfoOfUser['orgs'] {
    return orgs.map((o) => {
      return {
        _id: o._id,
        cep: o.cep,
        city: o.city,
        closeHour: o.closeHour,
        description: o.description,
        email: o.email,
        imageUrl: o.imageUrl,
        name: o.name,
        neighborhood: o.neighborhood,
        openHour: o.openHour,
        street: o.street,
        user: o.user,
        location: o.location,
        locationCode: o.locationCode,
      };
    });
  }

  static httpListAllOrgsResponse(
    orgs: OrgEntity[],
  ): OutPutListOrgsOfUser['orgs'] {
    return orgs.map((o) => {
      return {
        _id: o._id,
        name: o.name,
        imageUrl: o.imageUrl,
      };
    });
  }
}
