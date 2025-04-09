import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextFunction, Request, Response } from 'express';
import { Socket } from 'node:net';
import { ConfigService } from '@nestjs/config';
import { ConsulService } from '@app/consul';
import { match } from 'path-to-regexp';

interface Route {
  service: string;
  path: string; // 使用字符串路径模式
}

interface ServiceInstance {
  ID: string;
  Service: string;
  Tags: string[];
  Meta: Record<string, any>;
  Port: number;
  Address: string;
  TaggedAddresses: Record<string, any>;
  Weights: { Passing: number; Warning: number };
  EnableTagOverride: boolean;
  Datacenter: string;
}

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);
  private proxies: {
    matcher: ReturnType<typeof match>;
    instances: ServiceInstance[];
    currentIndex: number;
  }[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly consulService: ConsulService,
  ) {
    setInterval(() => {
      void this.initProxies();
    }, 2000);
  }

  private async initProxies() {
    this.proxies = [];
    const routesString = this.configService.get<string>('ROUTES');
    const routes = JSON.parse(routesString!) as Route[];
    for (const { service, path } of routes) {
      try {
        const serviceInfo = await this.consulService.discoverServiceByName(service);
        const instances = Object.values(serviceInfo) as ServiceInstance[];
        if (instances.length === 0) {
          this.logger.warn(`No instances found for service ${service}`);
          continue;
        }
        const matcher = match(path);
        this.proxies.push({ matcher, instances, currentIndex: -1 });
      } catch (error: unknown) {
        this.logger.error(`Failed to discover service ${service}:`, (error as Error).message);
      }
    }
  }

  private getNextTarget(instances: ServiceInstance[], index: number): string {
    const instance = instances[index];
    return `http://${instance.Address}:${instance.Port}`;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const originalUrl = req.originalUrl;
    for (const { matcher, instances, currentIndex } of this.proxies) {
      const matchResult = matcher(originalUrl);
      if (matchResult) {
        const nextIndex = (currentIndex + 1) % instances.length;
        this.proxies.find((p) => p.matcher === matcher)!.currentIndex = nextIndex;
        const nextTarget = this.getNextTarget(instances, nextIndex);
        return createProxyMiddleware<Request, Response>({
          target: nextTarget + matchResult.path,
          changeOrigin: true,
          logger: console,
          on: {
            error: (err, req, res) => {
              if (!(res instanceof Socket)) {
                res.status(500);
                res.json({ message: 'error' });
              }
            },
          },
        })(req, res, next);
      }
    }
    next();
  }
}
