import { Injectable } from '@nestjs/common';
import { catchError, from, map, mergeMap, throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  // 假设这是你的 create 方法
  create(createStudentInput: CreateStudentInput) {
    return from(
      this.prismaService.student.findFirst({
        where: { name: createStudentInput.name },
      }),
    ).pipe(
      mergeMap((student) => {
        if (student) return throwError(() => new Error('学生已存在'));

        return from(this.prismaService.student.create({ data: createStudentInput }));
      }),
      catchError((error: Error) => {
        console.error('Error during student creation:', error);
        return throwError(() => error); // 重新抛出错误以供订阅者处理
      }),
    );
  }

  findAll() {
    return from(this.prismaService.teacher.findMany());
  }

  findOne(id: string) {
    console.log(id);
    this.prismaService.teacher.findMany().then((res) => {
      console.log(res);
    });
    return from(this.prismaService.teacher.findMany()).pipe(map((teachers) => teachers.find((teacher) => teacher.id === id)));
  }

  update(id: number, updateStudentInput: UpdateStudentInput) {
    return `This action updates a #${id} student`;
  }

  remove(id: string) {
    return from(this.prismaService.student.delete({where: {id}}))
  }
}
