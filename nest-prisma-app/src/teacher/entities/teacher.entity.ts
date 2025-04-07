import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Student } from '../../student/entities/student.entity';

/**
 * Teacher 对象类型定义，用于 GraphQL。
 * 此类表示 GraphQL 模式中教师实体的结构。
 */
@ObjectType({
  description: '表示一个教师实体及其关联的学生。',
})
export class Teacher {
  @Field(() => ID, {
    description: '教师的唯一标识符。',
  })
  id: string;

  @Field(() => String, {
    description: '教师的全名。',
  })
  name: string;

  @Field(() => Int, {
    description: '教师的年龄。',
    nullable: true, // 假设年龄可以为空
  })
  age?: number;

  @Field(() => [Student], {
    description: '由该教师教授的学生列表。如果没有关联的学生，则可以为空。',
    nullable: true,
  })
  students?: Array<Student>;
}
