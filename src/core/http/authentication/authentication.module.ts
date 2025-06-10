import { RepositoryModule } from '@infra/repository/repository.module';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [RepositoryModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
