import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ArrayNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名', example: '产品经理' })
  @IsString({ message: '角色名必须为字符串' })
  @IsNotEmpty({ message: '角色名不能为空' })
  name: string;

  @ApiProperty({ description: '角色描述', example: '负责产品管理相关的工作' })
  @IsString({ message: '角色描述必须为字符串' })
  description: string;

  @ApiProperty({ description: '角色备注', example: 'product-manager' })
  @IsString({ message: '角色备注必须为字符串' })
  remark: string;

  @ApiProperty({
    description: '权限ID列表',
    example: [1, 2, 3],
    type: Number,
    isArray: true,
  })
  @ArrayNotEmpty({ message: '权限列表不能为空' })
  @IsNumber({}, { each: true, message: '权限ID必须为数字' })
  permissions: number[];
}