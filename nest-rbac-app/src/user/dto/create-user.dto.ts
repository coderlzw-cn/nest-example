import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEmail, IsString, ValidateNested } from 'class-validator';

export class CreateUserDto {
  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString({ message: '用户名必须为字符串' })
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString({ message: '密码必须为字符串' })
  password: string;

  @ApiProperty({ description: '邮箱', example: 'john.doe@example.com' })
  @IsEmail({}, { message: '电子邮件格式无效' })
  email: string;

  @ApiProperty({ description: '用户角色列表', example: [1, 2], type: Number, isArray: true })
  @ArrayNotEmpty({ message: '角色列表不能为空' }) // 确保至少有一个角色被分配
  @ValidateNested({ each: true }) // 如果需要更复杂的嵌套对象验证
  @Type(() => Number) // 强制转换数组元素类型为数字
  roles: number[];
}
