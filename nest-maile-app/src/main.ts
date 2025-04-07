import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(parseInt(process.env.PORT!), process.env.HOST!);
  Logger.log(`Server is running on: ${await app.getUrl()}`, 'NestApplication');
}

void bootstrap();
