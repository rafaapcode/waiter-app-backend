import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infra/repository/repository.module';
import { UserModule } from '../user/user.module';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';

@Module({
  imports: [RepositoryModule, UserModule],
  controllers: [OrgController],
  providers: [OrgService],
})
export class OrgModule {}
