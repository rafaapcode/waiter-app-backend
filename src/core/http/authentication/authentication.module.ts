import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infra/repository/repository.module';
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
