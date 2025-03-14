import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('skip') skip?: string, @Query('take') take?: string) {
    // Получаем пользователей через сервис
    const users = await this.usersService.users({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });

    // Дополняем каждого пользователя информацией о роли
    const usersWithRoles = await Promise.all(
      users.map(async (user) => ({
        ...user,
        roleName: await this.usersService.userRole({ id: user.id }),
      })),
    );

    return usersWithRoles;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.usersUpdateInput,
  ) {
    return this.usersService.updateUser({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser({ id: parseInt(id, 10) });
  }
}
