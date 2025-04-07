import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateTeacherInput } from './create-teacher.input';

@InputType()
export class UpdateTeacherInput extends PartialType(CreateTeacherInput) {
  @Field(() => Int)
  id: number;
}
