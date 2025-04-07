import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from './permission/permission.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs_rbac',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    UserModule,
    RolesModule,
    PermissionModule,
    RouteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
