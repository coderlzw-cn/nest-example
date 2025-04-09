import { ConsulModuleOptions } from '@app/consul/consul.options';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ConsulModuleOptions>()
  .setExtras({ isGlobal: true }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .setClassMethodName('forRoot')
  .build();
