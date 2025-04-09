import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './httpException.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  await app.listen(process.env.PORT ?? 3000, process.env.HOST!);
  app.useGlobalFilters(new HttpExceptionFilter());
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
