import { Logger, Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { from, of, switchMap } from 'rxjs';
import { teachers } from '../data';
import { PrismaService } from '../prisma/prisma.service';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';

@Module({
  providers: [TeacherResolver, TeacherService],
})
export class TeacherModule {
  private readonly logger = new Logger(TeacherModule.name);

  constructor(private readonly prismaService: PrismaService) {
    from(this.prismaService.teacher.findMany())
      .pipe(
        switchMap((teacherList) => {
          if (teacherList.length === 0) {
            return this.prismaService.teacher.createMany({ data: teachers as unknown as Prisma.TeacherCreateInput[] });
          }
          return of(null);
        }),
      )
      .subscribe(() => this.logger.log(`教师数据表初始完成`));
  }
}
