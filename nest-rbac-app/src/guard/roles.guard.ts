import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    // 如果接口上没有设置 @Roles()，则说明是不需要任何角色即可访问的，则直接放行
    if (!requiredRoles) return true;

    // TODO JWT 认证后，将用户信息挂载到 request 上，先在这里模拟一下用户信息
    // const request = context.switchToHttp().getRequest();
    const user = new UserEntity({ id: 1, username: 'admin', email: 'admin@example.com' });

    // 如果Controller 或者 Method 上设置了 @Roles()，则判断当前用户的角色是否包含在接口上标注的角色中
    return this.matchRoles(requiredRoles, user);
  }

  /**
   * 递归获取当前用户的所有角色
   * @param requiredRoles 需要的权限，例如 ['admin', 'create']
   * @param user
   * @private
   */
  private async matchRoles(requiredRoles: string[], user: UserEntity) {
    // 获取当前用户，并将用户的角色查询出来
    const userWithRoles = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: user.id },
      relations: { roles: true },
    });
    if (!userWithRoles) throw new UnauthorizedException('用户不存在');

    // 数据表中用户的角色集合
    const roles = new Set<string>();

    for (const role of userWithRoles.roles) {
      roles.add(role.name);
    }
    // 判断当前接口上标注的角色是否包含在用户的角色集合中
    return requiredRoles.every((role) => roles.has(role));
  }
}
