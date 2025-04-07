import { NestFactory } from '@nestjs/core';
import { UserAppModule } from './user-app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserAppModule);
  await app.listen(Number(process.env.PORT), String(process.env.HOST));
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
}

void bootstrap();
