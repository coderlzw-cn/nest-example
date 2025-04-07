import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as path from 'node:path';
import { ConsulModule } from '@app/consul';

const consulConfig = registerAs('consul', () => {
  return {
    isGlobal: true,
    host: process.env.CONSUL_HOST ?? '127.0.0.1',
    port: Number(process.env.CONSUL_PORT),
    registerOptions: {
      id: process.env.APPLICATION_NAME as string,
      name: process.env.APPLICATION_NAME as string,
      host: process.env.HOST!,
      port: Number(process.env.PORT),
    },
  };
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env'),
      load: [consulConfig],
    }),
    UserModule,
    ConsulModule.forRootAsync({
      inject: [consulConfig.KEY],
      useFactory: (configuration: ConfigType<typeof consulConfig>) => configuration,
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserAppModule {}
