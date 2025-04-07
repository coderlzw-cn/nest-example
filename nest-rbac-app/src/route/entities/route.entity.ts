import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '权限作用的api方法', example: 'GET' })
  @Column({ type: 'enum', enum: ['GET', 'POST', 'PUT', 'DELETE'], comment: 'Api 接口方法' })
  method: string;

  @ApiProperty({ description: '权限作用的api地址', example: '/api/v1/products' })
  @Column({ type: 'varchar', length: 255, comment: 'Api 接口路径' })
  path: string;

  @ManyToMany(() => Permission, (permission) => permission.routes)
  permissions: Permission[];
}
