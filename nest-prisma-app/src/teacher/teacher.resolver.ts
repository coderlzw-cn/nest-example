import { Inject, Logger, Version } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);

  constructor(
    private readonly teacherService: TeacherService,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  @Mutation(() => Teacher, { description: '创建用户' })
  createTeacher(@Args('createTeacherInput') createTeacherInput: CreateTeacherInput) {
    return this.teacherService.create(createTeacherInput);
  }

  @Version('1')
  @Query(() => [Teacher], { name: 'teachers', description: '查询所有教师', deprecationReason: '弃用' })
  findTeachers_v1() {
    return this.teacherService.findTeachers_v1();
  }

  @Version('2')
  @Query(() => [Teacher], { name: 'teachers', description: '查询所有教师' })
  findTeachers_v2() {
    return this.teacherService.findTeachers_v2();
  }

  @Query(() => Teacher, { name: 'teacher', description: '根据id查询教师' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.teacherService.findOne(id);
  }

  @Mutation(() => Teacher, { description: '更新教师' })
  updateTeacher(@Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput) {
    return this.teacherService.update(updateTeacherInput.id, updateTeacherInput);
  }

  @Mutation(() => Teacher, { description: '根据id删除' })
  removeTeacher(@Args('id', { type: () => String }) id: string) {
    return this.teacherService.remove(id);
  }
}
