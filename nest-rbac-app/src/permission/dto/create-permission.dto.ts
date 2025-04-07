import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名', example: '创建用户' })
  @IsString({ message: '权限名必须是字符串' })
  @IsNotEmpty({ message: '权限名不能为空' })
  name: string;

  @ApiProperty({ description: '权限描述', example: '允许创建新用户' })
  @IsString({ message: '权限描述必须是字符串' })
  description: string;

  @ApiProperty({ description: '权限标识', example: 'perm:create_user' })
  @IsString({ message: '权限标识必须是字符串' })
  @IsNotEmpty({ message: '权限标识不能为空' })
  identifier: string;
}