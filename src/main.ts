import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
  });
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
