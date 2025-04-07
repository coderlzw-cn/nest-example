import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsulModule, ConsulService } from '@app/consul';
import { ConfigModule, ConfigType, registerAs } from '@nestjs/config';
import * as path from 'node:path';

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
    ConsulModule.forRootAsync({
      inject: [consulConfig.KEY],
      useFactory: (configuration: ConfigType<typeof consulConfig>) => configuration,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly consulService: ConsulService) {
    setTimeout(() => {
      // this.consulService.consul.
      this.consulService
        .getKeyv()
        .get('test')
        .then((res) => {
          console.log(res);
        });
      // this.consulService.discoverServices().subscribe((value) => {
      //   console.log(value, '-----');
      // });
      // this.consulService.discoverNodesByName('UserApp').subscribe((value) => {
      //   console.log(value, '-----');
      // });
    }, 2000);
  }
}
