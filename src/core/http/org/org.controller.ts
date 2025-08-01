import { GetPartialDataOfOrgByIdOutPut } from '@infra/repository/org/type';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@shared/decorators/getCurrentUser.decorator';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { Role } from '../authentication/roles/role.enum';
import { CreateOrgDTO, UpdateOrgDTO } from './dto/Input.dto';
import {
  OutPutCreateOrgDto,
  OutPutGetOrgDto,
  OutPutListOrgsInfoOfUser,
  OutPutListOrgsOfUser,
  OutPutMessageDto,
  OutPutUpdateOrgDto,
} from './dto/OutPut.dto';
import { OrgEntity } from './entity/org.entity';
import { OrgService } from './services/org.service';

@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteOrg(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<OutPutMessageDto> {
    const deleted = await this.orgService.deleteOrg(user.id, id);
    if (!deleted) {
      throw new InternalServerErrorException(
        'Erro ao deletar a organizção , entre em contato com o suporte',
      );
    }
    return { message: 'Organização deletada !' };
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutUpdateOrgDto))
  async updateOrg(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() orgData: UpdateOrgDTO,
  ): Promise<OutPutUpdateOrgDto> {
    const org = OrgEntity.toUpdate(orgData);
    const orgUpdated = await this.orgService.updateOrg(user.id, id, org);
    return orgUpdated.httpUpdateResponse();
  }

  @Post('')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateOrgDto))
  async createOrg(
    @CurrentUser() user: JwtPayload,
    @Body() orgData: CreateOrgDTO,
  ): Promise<OutPutCreateOrgDto> {
    const newOrg = OrgEntity.newOrg({
      ...orgData,
      user: user.id,
    });
    const org = await this.orgService.createOrg(newOrg);

    return org.httpCreateResponse();
  }

  @Get('user/info')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListOrgsInfoOfUser, 'orgs'),
  )
  async getOrgInfoOfUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<OutPutListOrgsInfoOfUser> {
    const orgs = await this.orgService.getAllOrgsOfUser(user.id);
    return {
      orgs: OrgEntity.httpGetAllOrgsInfoResponse(orgs),
    };
  }

  @Get('user')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptorArray(OutPutListOrgsOfUser, 'orgs'))
  async listOrgOfUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<OutPutListOrgsOfUser> {
    const orgs = await this.orgService.getAllOrgsOfUser(user.id);
    return {
      orgs: OrgEntity.httpListAllOrgsResponse(orgs),
    };
  }

  @Get('/:orgid')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutGetOrgDto))
  async getOrg(
    @CurrentUser() user: JwtPayload,
    @Param('orgid') orgid: string,
  ): Promise<GetPartialDataOfOrgByIdOutPut> {
    const org = await this.orgService.getOrgId(user.id, orgid);
    return org;
  }
}
