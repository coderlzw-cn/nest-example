import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { Route } from '../route/entities/route.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // TODO JWT 认证后，将用户信息挂载到 request 上
    const user = new UserEntity({ id: 1, username: 'admin', email: 'admin@example.com' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const path = request.route.path as string; // /api/user/:id
    const method = request.method;
    this.logger.debug(`权限守卫 ${method} ${path}`);
    return this.matchPermissions(path, method, user);
  }

  private async matchPermissions(path: string, method: string, user: UserEntity) {
    // 当前路由上绑定着该路由的权限集合
    const route = await this.dataSource.getRepository(Route).findOne({
      where: { path: path, method: method },
      relations: { permissions: true },
    });

    const userEntity = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: user.id },
      relations: { roles: { permissions: true } },
    });

    if (!userEntity) return false;

    // 分配到用户的权限集合
    const userIdentifiers = userEntity.roles?.map((role) => role.permissions.map((permission) => permission.identifier));
    const userIdentifiersSet = new Set<string>();
    for (const identifier of userIdentifiers) {
      for (const permission of identifier) {
        userIdentifiersSet.add(permission);
      }
    }

    // 某个路由上绑定的权限集合
    const routeIdentifierList = route!.permissions.map((permission) => permission.identifier);

    console.log('分配给用户的权限', userIdentifiersSet);
    console.log('路由上绑定的权限', path, method, routeIdentifierList);
    // 判断用户所拥有的权限是否包含在路由上绑定的权限集合中
    return [ 'product:create', 'product:edit', "proi" ].some((permission) => userIdentifiersSet.has(permission));
  }

}
