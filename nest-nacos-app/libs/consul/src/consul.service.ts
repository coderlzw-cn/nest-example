import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as Consul from 'consul';
import { DeregisterResult, MaintenanceOptions, MaintenanceResult } from 'consul/lib/agent/service';
import { from, lastValueFrom, map, retry, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MODULE_OPTIONS_TOKEN } from './consul.module-definition';
import { ConsulModuleOptions } from './consul.interface';

@Injectable()
export class ConsulService {
  private readonly logger = new Logger(ConsulService.name);
    readonly consul: Consul;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: ConsulModuleOptions) {
    console.log(options);
    this.consul = new Consul({
      host: this.options.host,
      port: this.options.port,
    });
  }

  /**
   * 注册服务到 Consul
   */
  async register() {
    let retryCount = 0; // 记录重试的次数
    const maxRetryCount = this.options.retryCount ?? 7; // 默认重试次数
    const retryDelay = this.options.retryDelay ?? 2000; // 默认重试间隔
    this.logger.log(`🔄 正在注册 ${this.options.registerOptions.name} 服务...`);
    await to(
      lastValueFrom(
        from(this.consul.agent.service.register(this.options.registerOptions)).pipe(
          retry({ count: maxRetryCount, delay: retryDelay }),
          tap({
            next: () => {
              retryCount = 0;
              this.logger.log(`✅ 服务 ${this.options.registerOptions.name} 注册成功！`);
            },
            error: (error: Error) => {
              retryCount++;
              this.logger.warn(`⚠️ ${this.options.registerOptions.name} 服务注册失败（尝试 ${retryCount}/${maxRetryCount} ）: ${error.message}`);
            },
          }),
          catchError((error: Error) => {
            this.logger.error(`🚨 邮件服务器连接失败: ${error}`);
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  /**
   * 注销服务
   * @param id
   */
  async deregister(): Promise<DeregisterResult> {
    this.logger.log(`🛑 正在注销服务 ${this.options.registerOptions.name}...`);
    return await this.consul.agent.service.deregister(this.options.registerOptions.name);
  }

  /**
   * 设置服务为维护
   * @param options
   */
  async maintenance(options: MaintenanceOptions): Promise<MaintenanceResult> {
    return await this.consul.agent.service.maintenance(options);
  }

  /**
   * 返回所有的已注册的服务
   * @param serviceName
   */
  discoverServices() {
    return from(this.consul.agent.service.list());
  }

  /**
   * 根据服务名获取已注册的服务
   * @param serviceName
   */
  discoverServiceByName(serviceName: string) {
    return from(this.consul.agent.service.list()).pipe(
      map((services) => {
        return Object.fromEntries(Object.entries(services).filter(([, value]) => value.Service === serviceName));
      }),
    );
  }

  /**
   * 列出给定节点列表
   * @param nodeName
   */
  discoverNodesByName(nodeName: string) {
    return from(this.consul.catalog.service.nodes(nodeName));
  }

  // 获取keyv
  getKeyv() {
    return this.consul.kv;
  }
}
