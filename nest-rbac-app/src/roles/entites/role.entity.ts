import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('roles')
export class RoleEntity {
  constructor(partial?: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '角色名称', uniqueItems: true, example: '商品管理员' })
  @Column({ type: 'varchar', length: 255, unique: true, comment: '角色名称' })
  name: string;

  @ApiProperty({ description: '角色备注', uniqueItems: true, example: '商品管理员' })
  @Column({ type: 'varchar', length: 255, comment: '角色备注' })
  remark: string;

  @ApiProperty({ description: '角色描述', example: '商品管理员' })
  @Column({ type: 'varchar', length: 255, comment: '角色描述' })
  description: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;

  @ApiProperty({ description: '角色用户' })
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ApiProperty({ description: '角色权限' })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToMany(() => RoleEntity, (role) => role.parents)
  @JoinTable({
    name: 'role_hierarchy',
    joinColumn: { name: 'parent_role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'child_role_id', referencedColumnName: 'id' },
  })
  children: RoleEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.children)
  parents: RoleEntity[];
}
