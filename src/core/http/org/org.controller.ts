import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { CurrentUser } from '../authentication/decorators/getCurrentUser.decorator';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CreateOrgDTO, UpdateOrgDTO } from './dto/Input.dto';
import {
  OutPutCreateOrgDto,
  OutPutGetOrgDto,
  OutPutListOrgsOfUser,
  OutPutMessageDto,
  OutPutUpdateOrgDto,
} from './dto/OutPut.dto';
import { OrgService } from './org.service';

@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  @Delete('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteOrg(@Param('id') id: string): Promise<OutPutMessageDto> {
    const deleted = await this.orgService.deleteOrg(id);
    if (!deleted) {
      throw new BadGatewayException('Erro ao deletar a organização');
    }
    return { message: 'Organização deletada !' };
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutUpdateOrgDto))
  async updateOrg(
    @Param('id') id: string,
    @Body() orgData: UpdateOrgDTO,
  ): Promise<OutPutUpdateOrgDto> {
    return await this.orgService.updateOrg(id, orgData);
  }

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateOrgDto))
  async createOrg(@Body() orgData: CreateOrgDTO): Promise<OutPutCreateOrgDto> {
    return await this.orgService.createOrg(orgData);
  }

  @Get('user')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptorArray(OutPutListOrgsOfUser, 'orgs'))
  async getOrgOfUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<OutPutListOrgsOfUser> {
    const orgs = await this.orgService.getAllOrgsOfUser(user.id);
    return {
      orgs,
    };
  }

  @Get('/:orgid')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutGetOrgDto))
  async getOrg(@Param('orgid') orgid: string): Promise<OutPutGetOrgDto> {
    return await this.orgService.getOrgId(orgid);
  }
}
