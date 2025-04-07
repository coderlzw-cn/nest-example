import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './HttpExceptionFilter';
import { AppModule } from './app.module';

declare const module: {
  hot: { accept: () => void; dispose: (argument: () => Promise<void>) => void };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // https://github.com/nestjs/nest/issues/14838#issuecomment-2757075397
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // process.on('SIGTERM', async () => {
  //   if (app) {
  //     await app.close();
  //   }
  // });
}

void bootstrap();
