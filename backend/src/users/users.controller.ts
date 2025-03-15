import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() data: { email: string; password: string; roleName: string },
  ) {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(data.password)
      .digest('hex');
    const user = await this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
      roles: {
        connect: { name: data.roleName },
      },
    });
    return user;
  }

  @Get()
  async getUsers(@Query('skip') skip?: string, @Query('take') take?: string) {
    const users = await this.usersService.users({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });

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
