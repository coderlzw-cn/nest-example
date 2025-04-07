import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  const options = new DocumentBuilder().setTitle('RBAC API').setDescription('基于角色的访问控制系统的API描述').setVersion('1.0').addTag('rbac').build();
  // const reflector = app.get(Reflector);
  // const dataSource = app.get(DataSource);
  // app.useGlobalGuards(new RolesGuard(reflector, dataSource));
  // app.useGlobalGuards(new PermissionGuard(reflector, dataSource));

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Application is running on: ${(await app.getUrl()).replace('http://[::1]', 'http://127.0.0.1')}`);
  Logger.log(`Swagger is running on: ${(await app.getUrl()).replace('http://[::1]', 'http://127.0.0.1')}/api`);
}

void bootstrap();
