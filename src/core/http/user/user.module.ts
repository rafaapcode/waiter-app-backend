import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infra/repository/repository.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [RepositoryModule],
  providers: [UserService, JwtService, ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
