import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

console.log(__dirname);
console.log(process.cwd());

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
