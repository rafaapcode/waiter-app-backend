import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OrgController } from './org.controller';
import { OrgService } from './services/org.service';
import { VerifyOrgOwnershipService } from './services/verifyOrgOwnership.service';

@Module({
  imports: [RepositoryModule, UserModule],
  controllers: [OrgController],
  providers: [OrgService, VerifyOrgOwnershipService],
  exports: [VerifyOrgOwnershipService],
})
export class OrgModule {}
