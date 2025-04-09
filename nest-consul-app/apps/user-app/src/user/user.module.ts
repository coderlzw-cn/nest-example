import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigType, registerAs } from '@nestjs/config';
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
    keys: [],
  };
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env'),
      load: [consulConfig],
    }),
    ConsulModule.forRootAsync({
      inject: [consulConfig.KEY],
      useFactory: (configuration: ConfigType<typeof consulConfig>) => configuration,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
