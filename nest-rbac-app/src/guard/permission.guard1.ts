import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
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
    const path = request.path;
    const method = request.method;
    this.logger.log(`Permission 守卫 ${method} ${path}`);
    // TODO 模拟从数据表中获取的权限，根据请求地址和请求方法，获取用户所拥有的权限
    const requiredPermission = ['product:view', 'product:create'];
    const requirePermissions = this.reflector.getAllAndOverride<string[]>('permissions', [context.getHandler(), context.getClass()]);
    // 如果接口上没有设置 @Roles() 和 @Permission()，则直接放行
    if (!requirePermissions) return true;

    return this.matchPermissions(requirePermissions, user);
  }

  private async matchPermissions(requiredPermissions: string[], user: UserEntity) {
    const userWithRoles = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: user.id },
      relations: { roles: { permissions: true } },
    });
    const roles = userWithRoles?.roles;
    if (!roles) throw new UnauthorizedException('用户不存在');

    // 数据表中用户的所有权限
    const allPermissions = new Set<string>();

    for (const role of roles) {
      for (const permission of role.permissions) {
        allPermissions.add(permission.name);
      }
    }
    return requiredPermissions.every((permission) => allPermissions.has(permission));
  }
}
