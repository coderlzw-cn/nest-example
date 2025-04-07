import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createTeacherInput: CreateTeacherInput) {
    return from(this.prismaService.teacher.create({ data: createTeacherInput })).pipe(
      catchError((err, caught) => {
        return throwError(() => new Error('创建用户出错'));
      }),
    );
  }

  /**
   * @deprecated
   */
  findTeachers_v1() {
    return from(this.prismaService.teacher.findMany()).pipe(
      switchMap((teachers) => {
        return from(this.prismaService.student.findMany()).pipe(
          map((students) => {
            console.log('---', students, '-----');
            return teachers.map((teacher) => {
              return {
                ...teacher,
                students: students.filter((student) => student.teacherId === teacher.id),
              };
            });
          }),
        );
      }),
    );
  }

  findTeachers_v2() {
    return from(
      this.prismaService.teacher.findMany({
        include: {
          students: true, // 包含与教师相关联的学生
        },
      }),
    ).pipe(
      map((teachers) => {
        return teachers.map((teacher) => ({
          ...teacher,
          students: teacher.students || [],
        }));
      }),
      catchError((error) => {
        console.error('Error fetching teachers with students:', error);
        return of([]); // 在发生错误时返回空数组或其他适当的默认值
      }),
    );
  }

  findOne(id: string) {
    return from(this.prismaService.student.findFirst({ where: { id } })).pipe(
      switchMap((teacher) => {
        if (!teacher) {
          throw new Error('Teacher not found');
        }
        // 根据老师的 ID 查询所有属于该老师的学生
        return from(
          this.prismaService.student.findMany({
            where: { teacherId: id },
          }),
        ).pipe(
          map((students) => {
            // 将学生列表添加到老师的对象中
            return { ...teacher, students };
          }),
          catchError((error) => {
            console.error('Error fetching students:', error);
            throw error;
          }),
        );
      }),
      catchError((error) => {
        console.error('Error fetching teacher:', error);
        throw error;
      }),
    );
  }

  update(id: number, updateTeacherInput: UpdateTeacherInput) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: string) {
    return from(this.prismaService.teacher.delete({ where: { id } }));
  }
}
