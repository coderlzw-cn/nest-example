import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsulModule, ConsulService } from '@app/consul';
import { ConfigModule, ConfigType, registerAs } from '@nestjs/config';
import * as path from 'node:path';
import { ConsulModuleOptions } from '@app/consul/consul.interface';
import { ConsumeService } from '@app/consul/consume.service';
import { ProxyMiddleware } from './middleware/proxy.middleware';

const consulConfig = registerAs('consul', () => {
  return {
    isGlobal: true,
    host: process.env.CONSUL_HOST ?? '127.0.0.1',
    port: Number(process.env.CONSUL_PORT),
    registerOptions: {
      id: process.env.APPLICATION_NAME as string,
      name: process.env.APPLICATION_NAME as string,
      address: process.env.HOST!,
      port: Number(process.env.PORT),
      tags: ['nest-consul'],
    },
    keys: ['test', 'test1'],
  } as ConsulModuleOptions;
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
      useFactory: (configuration: ConfigType<typeof consulConfig>) => {
        return configuration;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly consulService: ConsulService,
    private readonly consumeService: ConsumeService,
  ) {
    setTimeout(() => {
      // this.consulService.discoverServices().then(console.log);
      // this.consulService.discoverServiceByName('UserApp');
      // this.consumeService.request('UserApp', "GET", "/user").then(res=>{
      //   console.log(res.data);
      // })
      // this.consulService.discoverNodesByName('UserApp').then(console.log);
      this.consulService.onConfigurationUpdate().subscribe((value) => {
        console.log(value);
      });
    }, 1000);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes('*path');
  }
}
