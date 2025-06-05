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
} from '@nestjs/common';
import { OrgType } from 'src/types/Org.type';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CreateOrgDto } from './dto/createOrg.dto';
import { UpdateOrgDto } from './dto/updateOrg.dto';
import { OrgService } from './org.service';

@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async createOrg(@Body() orgData: CreateOrgDto): Promise<OrgType> {
    return await this.orgService.createOrg(orgData);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async updateOrg(
    @Param('id') id: string,
    @Body() orgData: UpdateOrgDto,
  ): Promise<OrgType> {
    return await this.orgService.updateOrg(id, orgData);
  }

  @Delete('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async deleteOrg(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.orgService.deleteOrg(id);
    if (!deleted) {
      throw new BadGatewayException('Erro ao deletar a organização');
    }
    return { message: 'Organizção deletada !' };
  }

  @Get('user/:userid')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getOrgOfUser(@Param('userid') userid: string): Promise<OrgType[]> {
    return await this.orgService.getAllOrgsOfUser(userid);
  }

  @Get('/:orgid')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getOrg(@Param('orgid') orgid: string): Promise<OrgType> {
    return await this.orgService.getOrgId(orgid);
  }
}
