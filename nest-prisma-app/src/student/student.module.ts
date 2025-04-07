import { Logger, Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { from, of, switchMap } from 'rxjs';
import { students, teachers } from '../data';
import { PrismaService } from '../prisma/prisma.service';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

@Module({
  providers: [StudentResolver, StudentService],
})
export class StudentModule {
  private readonly logger = new Logger(StudentModule.name);

  constructor(private readonly prismaService: PrismaService) {
    from(this.prismaService.student.findMany())
      .pipe(
        switchMap((studentList) => {
          if (studentList.length === 0) {
            const data = students.map((student) => {
              return {
                ...student,
                teacherId: teachers.find((teacher) => teacher.id === Math.floor(Math.random() * 20).toString())?.id ?? '1',
              };
            }) as Prisma.StudentUncheckedCreateInput[];
            return this.prismaService.student.createMany({ data });
          }
          return of(null);
        }),
      )
      .subscribe(() => this.logger.log(`学生数据表初始完成`));
  }
}
