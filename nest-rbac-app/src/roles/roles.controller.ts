import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@ApiTags('角色')
@Controller('role')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: '查询角色' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  roles() {
    return this.rolesService.roles();
  }

  @ApiOperation({ summary: '新增角色' })
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: '查询用户角色', description: '根据用户id，查询出用户的权限列表' })
  @Get('user/:id')
  async getUserRoles(@Param('id') id: number) {
    return await this.rolesService.getUserRoles(id);
  }
}
