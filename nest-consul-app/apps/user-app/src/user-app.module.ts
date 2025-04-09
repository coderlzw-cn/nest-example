import { BeforeApplicationShutdown, Module, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as path from 'node:path';
import { ConsulModule, ConsulService } from '@app/consul';
import { ConsulModuleOptions } from '@app/consul/consul.interface';
import { HealthModule } from './health/health.module';
import * as process from 'node:process';

const consulConfig = registerAs('consul', () => {
  return {
    isGlobal: true,
    host: process.env.CONSUL_HOST ?? '127.0.0.1',
    port: Number(process.env.CONSUL_PORT),
    registerOptions: {
      tags: ['nest-app', 'nest-user-app'],
      meta: {
        version: '1.0.0',
      },
      id: 'UserApp-[localhost]',
      name: process.env.APPLICATION_NAME as string,
      address: process.env.HOST!,
      port: Number(process.env.PORT),
      checks: [
        {
          name: '磁盘健康检查',
          http: `http://${process.env.HOST!}:${process.env.PORT}/api/health/storage`,
          interval: '10s',
          timeout: '10s',
        },
        {
          name: '内存健康检查',
          http: `http://${process.env.HOST!}:${process.env.PORT}/api/health/memory`,
          interval: '10s',
          timeout: '10s',
        },
      ],
    },
  } as ConsulModuleOptions;
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
    HealthModule,
  ],
  providers: [],
})
export class UserAppModule implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  constructor(private readonly consulService: ConsulService) {
    process.on('SIGINT', () => {
      void this.consulService.deregister();
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
  }

  onApplicationShutdown(signal?: string) {}

  beforeApplicationShutdown(signal?: string) {}

  onModuleInit() {
  }

  onModuleDestroy() {}
}
