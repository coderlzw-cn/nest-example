import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from '../../roles/entites/role.entity';
import { Route } from '../../route/entities/route.entity';

@Entity('permissions')
export class Permission {
  constructor(partial?: Partial<Permission>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '权限名称', uniqueItems: true, example: '查看产品列表' })
  @Column({ type: 'varchar', length: 255, unique: true, comment: '权限名' })
  name: string;

  @ApiProperty({ description: '权限描述', example: '拥有查看产品列表的权限' })
  @Column({ type: 'varchar', length: 255, comment: '权限描述' })
  description: string;

  @ApiProperty({ description: '权限标识', uniqueItems: true, example: 'product:view' })
  @Column({ type: 'varchar', length: 255, unique: true, comment: '权限标识' })
  identifier: string;

  @ApiProperty({ description: '权限状态', enum: ['active', 'inactive'] })
  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active', comment: '权限状态' })
  status: string;

  @ApiProperty({ description: '权限创建时间' })
  @CreateDateColumn({ comment: '权限创建时间' })
  @Exclude()
  createdAt: Date;

  @ApiProperty({ description: '权限更新时间' })
  @UpdateDateColumn({ comment: '权限更新时间' })
  @Exclude()
  updatedAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @ManyToMany(() => Route, (route) => route.permissions)
  @JoinTable({
    name: 'route_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'route_id',
      referencedColumnName: 'id',
    },
  })
  routes: Route[];

  toString() {
    return `Permission { id: ${this.id}, name: ${this.name}, description: ${this.description}, identifier: ${this.identifier}, status: ${this.status} }`;
  }
}
