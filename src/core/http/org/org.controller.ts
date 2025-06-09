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
import { JwtPayload } from 'src/shared/types/express';
import { OrgType } from 'src/shared/types/Org.type';
import { CurrentUser } from '../authentication/decorators/getCurrentUser.decorator';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CreateOrgDTO, UpdateOrgDTO } from './dto/org.dto';
import { OrgService } from './org.service';

@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  @Delete('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async deleteOrg(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.orgService.deleteOrg(id);
    if (!deleted) {
      throw new BadGatewayException('Erro ao deletar a organização');
    }
    return { message: 'Organização deletada !' };
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async updateOrg(
    @Param('id') id: string,
    @Body() orgData: UpdateOrgDTO,
  ): Promise<OrgType> {
    return await this.orgService.updateOrg(id, orgData);
  }

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async createOrg(@Body() orgData: CreateOrgDTO): Promise<OrgType> {
    return await this.orgService.createOrg(orgData);
  }

  @Get('user')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getOrgOfUser(@CurrentUser() user: JwtPayload): Promise<OrgType[]> {
    return await this.orgService.getAllOrgsOfUser(user.id);
  }

  @Get('/:orgid')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getOrg(@Param('orgid') orgid: string): Promise<OrgType> {
    return await this.orgService.getOrgId(orgid);
  }
}
