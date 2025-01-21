import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  health(): { status: string } {
    return { status: 'Your API is healthy!' };
  }
}
