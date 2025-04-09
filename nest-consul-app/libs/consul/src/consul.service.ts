import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as Consul from 'consul';
import { DeregisterResult, MaintenanceOptions, MaintenanceResult } from 'consul/lib/agent/service';
import { from, lastValueFrom, retry, Subject, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MODULE_OPTIONS_TOKEN } from './consul.module-definition';
import { ConsulModuleOptions } from './consul.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ConsulService {
  private readonly logger = new Logger(ConsulService.name);
  readonly consul: Consul;
  private configSubject = new Subject<any>();
  private config: Record<string, any> = {};

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: ConsulModuleOptions,
    private readonly httpService: HttpService,
  ) {
    this.consul = new Consul({ host: this.options.host, port: this.options.port });
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
            this.logger.error(`🚨 Consul 服务器连接失败: ${error}`);
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  /**
   * 注销服务
   */
  async deregister(): Promise<DeregisterResult> {
    this.logger.log(`🛑 正在注销服务 ${this.options.registerOptions.name}...`);
    console.log(this.options.registerOptions.id);
    return await this.consul.agent.service.deregister(this.options.registerOptions.id ?? '');
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
   * @returns Promise<Record<string, any>>
   */
  discoverServices() {
    return this.consul.agent.service.list();
  }

  /**
   * 检查服务健康状态
   * @param type
   */
  chechServiceHealth(type: 'id' | 'name' = 'name') {
    return this.httpService.get(
      `http://${this.options.host}:${this.options.port}/v1/agent/health/service/name/${type === 'name' ? this.options.registerOptions.name : this.options.registerOptions.id}`,
    );
  }

  /**
   * 根据服务名检查服务健康状态
   * @param serviceName
   */
  checkServiceHealthByName(serviceName: string) {
    return this.httpService.get(`http://${this.options.host}:${this.options.port}/v1/agent/health/service/name/${serviceName}`);
  }

  /**
   * 根据服务ID检查服务健康状态
   * @param serviceID
   */
  checkServiceHealthById(serviceID: string) {
    return this.httpService.get(`http://${this.options.host}:${this.options.port}/v1/agent/health/service/id/${serviceID}`);
  }

  /**
   * 根据服务名获取已注册的服务
   * @param serviceName 服务名
   * @returns Observable<Record<string, any>>
   */
  async discoverServiceByName(serviceName: string) {
    const services = await this.consul.agent.service.list();
    if (!services) throw new Error('服务不存在');
    const serviceList = Object.entries(services).filter(([, value]: [string, Record<string, any>]) => value.Service === serviceName);
    return Object.fromEntries(serviceList);
  }

  /**
   * 根据服务名称获取服务注册的节点信息
   * @param nodeName
   */
  discoverNodesByName(nodeName: string) {
    return this.consul.catalog.service.nodes(nodeName);
  }

  /**
   * 加载配置
   */
  async loadConfiguration() {
    for (const key of this.options.keys ?? []) {
      this.config[key] = await this.consul.kv.get(key);
    }
    this.configSubject.next(this.config);
  }

  /**
   * 监听配置的更新
   */
  watchConfiguration() {
    for (const key of this.options.keys ?? []) {
      this.consul
        .watch({
          method: this.consul.kv.get,
          options: { key },
        })
        .on('change', () => {
          void this.loadConfiguration();
        })
        .on('error', (error: Error) => {
          this.logger.error(`🚨 Consul 监听配置错误: ${error.message}`);
        });
    }
  }

  /**
   * 获取配置更新事件
   */
  onConfigurationUpdate() {
    return this.configSubject.asObservable();
  }
}
