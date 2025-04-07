import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/roles/entites/role.entity';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  findUsersWithRoles() {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async createUser(createUserDto: CreateUserDto) {
    const userEntity = new UserEntity({
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      roles: createUserDto.roles.map((roleId) => new RoleEntity({ id: roleId })),
    });
    return await this.userRepository.save(userEntity);
  }

  findUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }
}
