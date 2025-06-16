import { OrgRepository } from '@infra/repository/org/org.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VerifyOrgOwnershipService {
  constructor(private readonly orgRepository: OrgRepository) {}

  async verify(userid: string, orgId: string) {
    const isOwner = await this.orgRepository.verifyOrgOwnership(userid, orgId);

    if (!isOwner) {
      throw new NotFoundException('Organização não encontrada');
    }
  }
}
