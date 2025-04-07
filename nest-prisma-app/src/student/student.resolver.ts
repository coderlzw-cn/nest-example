import { Inject } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { students } from '../data';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';

@Resolver(() => Student)
export class StudentResolver {
  constructor(
    private readonly studentService: StudentService,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  @Mutation(() => Student, { description: '创建学生' })
  createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput) {
    console.log(createStudentInput);
    return this.studentService.create(createStudentInput);
  }

  @Mutation(() => Student, { description: '更新学生' })
  updateStudent(@Args('updateStudentInput') updateStudentInput: UpdateStudentInput) {
    return this.studentService.update(updateStudentInput.id, updateStudentInput);
  }

  @Query(() => [Student], { name: 'students', description: '查询所有学生', deprecationReason: '过时的API' })
  findAll() {
    return this.studentService.findAll();
  }

  @Query(() => Student, { name: 'student', description: '根据id查询学生', defaultValue: '20' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.studentService.findOne(id);
  }

  @Mutation(() => Student, { name: 'updateStudent', description: '根据id删除学生' })
  removeStudent(@Args('id', { type: () => String }) id: string) {
    return this.studentService.remove(id);
  }
}
