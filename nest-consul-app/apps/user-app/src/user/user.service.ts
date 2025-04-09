import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user  本地`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user 本地`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user 本地`;
  }

  remove(id: number) {
    return `This action removes a #${id} user 本地`;
  }
}
