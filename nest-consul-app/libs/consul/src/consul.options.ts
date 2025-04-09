import { RegisterOptions } from 'consul/lib/agent/service';

export type ConsulModuleOptions = {
  retryCount?: number;
  retryDelay?: number;
  registerOptions: RegisterOptions;
};
