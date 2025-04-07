import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class CreateTeacherInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' }) // 非空验证
  @MinLength(2, { message: '名称至少需要2个字符' }) // 最小长度
  @MaxLength(50, { message: '名称最多包含50个字符' }) // 最大长度
  name: string;

  @Field()
  @IsInt({ message: '年龄必须是一个整数' }) // 整数验证
  @Min(1, { message: '年龄最小值为1' }) // 最小值
  @Max(150, { message: '年龄最大值为150' }) // 最大值
  age: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '邮箱地址不能为空' }) // 非空验证
  @MinLength(6, { message: '邮箱地址至少需要6个字符' }) // 最小长度
  @IsEmail({}, { message: '邮箱格式不正确' }) // 邮箱验证
  email: string;
}
