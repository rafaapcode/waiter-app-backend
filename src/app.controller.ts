import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '@shared/decorators/isPublic';

@IsPublic()
@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  health(): { status: string } {
    return { status: 'Your API is healthy!' };
  }
}
