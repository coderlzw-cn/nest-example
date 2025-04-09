import Consul from 'consul';
import { RegisterOptions } from 'consul/lib/agent/service';

export type ConsulModuleOptions = {
  retryCount?: number;
  retryDelay?: number;
  registerOptions: RegisterOptions;
  keys?: string[];
} & ConstructorParameters<typeof Consul>[0];
