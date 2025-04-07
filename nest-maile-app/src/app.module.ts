import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'node:path';
import { ConfigModule, ConfigType, registerAs } from '@nestjs/config';

const mailerConfig = registerAs('mailer', () => {
  return {
    transport: process.env.MAILER_TRANSPORT,
    defaults: {
      from: process.env.MAILER_FROM,
    },
    template: {
      dir: path.join(__dirname, 'resources/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [mailerConfig],
    }),
    MailerModule.forRootAsync({
      inject: [mailerConfig.KEY],
      useFactory: (configuration: ConfigType<typeof mailerConfig>) => configuration,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
