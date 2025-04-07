import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Student {
  @Field(() => ID, { description: '学生id' })
  id: string;

  @Field(() => String, { description: '学生姓名' })
  name: string;

  @Field(() => Int, { defaultValue: '学生年龄' })
  age: number;

  @Field(() => String, { defaultValue: '学生邮箱' })
  email: string;

  @Field(() => String, { defaultValue: '教师ID' })
  teacherId: string;
}
