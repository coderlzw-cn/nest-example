import { NestFactory } from '@nestjs/core';
import { OrderAppModule } from './order-app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrderAppModule);
  console.log(process.env);
  await app.listen(Number(process.env.PORT), process.env.HOST!);
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
}

void bootstrap();
