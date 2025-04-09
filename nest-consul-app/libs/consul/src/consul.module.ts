import { ConfigurableModuleClass } from '@app/consul/consul.module-definition';
import { HttpModule } from '@nestjs/axios';
import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConsulService } from './consul.service';
import { ConsumeService } from './consume.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 9000,
      maxRedirects: 5,
      withCredentials: false,
    }),
  ],
  providers: [ConsulService, ConsumeService],
  exports: [ConsulService, ConsumeService],
})
export class ConsulModule extends ConfigurableModuleClass implements OnModuleInit, OnApplicationShutdown {
  constructor(readonly consulService: ConsulService) {
    super();
  }

  async onApplicationShutdown() {
    await this.consulService.deregister();
  }

  async onModuleInit() {
    await this.consulService.register();
    await this.consulService.loadConfiguration();
    this.consulService.watchConfiguration();
  }
}
