import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConsulService } from './consul.service';
import { ListResult } from 'consul/lib/agent/service';

type NodesResult = {
  Address: string;
  ServicePort: number;
};

@Injectable()
export class ConsumeService {
  private lastIndex = -1; // 记录上一次使用的服务实例索引

  constructor(
    private httpService: HttpService,
    private consulService: ConsulService,
  ) {}

  /**
   * 发送 HTTP 请求到 Consul 注册的服务
   * @param serviceName - 目标服务名称
   * @param method - 请求方法（GET、POST、PUT、DELETE）
   * @param endpoint - 具体 API 路径（例如 `/api/user/1`）
   * @param data - POST/PUT 请求的请求体（可选）
   * @param config - 其他 Axios 配置（可选）
   * @returns 响应数据
   */
  async request<R = any, T = any>(
    serviceName: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string = '',
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    // 服务注册到的实例列表
    const servicesMap = await this.consulService.discoverServiceByName(serviceName);
    const services = Object.values(servicesMap);

    if (!services || services.length === 0) {
      throw new Error('❌ 服务未发现');
    }

    // 默认采用轮训方案
    this.lastIndex = (this.lastIndex + 1) % services.length;
    const serviceInstance = services[this.lastIndex] as ListResult;
    const url = `http://${serviceInstance.Address}:${serviceInstance.Port}${endpoint}`;
    const axiosConfig: AxiosRequestConfig = { ...config, method, url, data };

    return await lastValueFrom(this.httpService.request<R>(axiosConfig));
  }

  /**
   * 发送 GET 请求
   */
  async get<T = any>(serviceName: string, endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>(serviceName, 'GET', endpoint, undefined, config);
  }

  /**
   * 发送 POST 请求
   */
  async post<T = any>(serviceName: string, endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>(serviceName, 'POST', endpoint, data, config);
  }

  /**
   * 发送 PUT 请求
   */
  async put<T = any>(serviceName: string, endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>(serviceName, 'PUT', endpoint, data, config);
  }

  /**
   * 发送 DELETE 请求
   */
  async delete<T = any>(serviceName: string, endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>(serviceName, 'DELETE', endpoint, undefined, config);
  }
}
