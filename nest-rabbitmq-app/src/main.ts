import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, '127.0.0.1');
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
}

void bootstrap();
