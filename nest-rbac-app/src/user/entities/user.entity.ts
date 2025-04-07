import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from '../../roles/entites/role.entity';

@Entity('user')
export class UserEntity {
  constructor(partial?: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户名', uniqueItems: true })
  @Column({ type: 'varchar', length: 255, unique: true, comment: '用户名' })
  username: string;

  @ApiProperty({ description: '密码' })
  @Column({ type: 'varchar', length: 255, comment: '密码' })
  password: string;

  @ApiProperty({ description: '邮箱', uniqueItems: true })
  @Column({ type: 'varchar', length: 255, unique: true, comment: '邮箱' })
  email: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;

  // 一个用户可以有多个角色，一个角色也可以分配给多个用户，因此它们之间是多对多关系
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
