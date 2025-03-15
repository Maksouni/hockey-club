import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.usersWhereUniqueInput,
  ): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.usersWhereUniqueInput;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }): Promise<users[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async usersCount(where?: Prisma.usersWhereInput): Promise<number> {
    return this.prisma.users.count({ where });
  }

  async userRole(
    userWhereUniqueInput: Prisma.usersWhereUniqueInput,
  ): Promise<string> {
    const user = await this.prisma.users.findUnique({
      where: userWhereUniqueInput,
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.roles.name;
  }

  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    try {
      return await this.prisma.users.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          (error.meta?.target as string[])?.includes('email')
        ) {
          throw new ConflictException('Email уже используется');
        }
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.players.updateMany({
      where: { user_id: user.id },
      data: { user_id: null },
    });
    await this.prisma.employees.updateMany({
      where: { user_id: user.id },
      data: { user_id: null },
    });
    await this.prisma.fans.updateMany({
      where: { user_id: user.id },
      data: { user_id: null },
    });

    return this.prisma.users.delete({
      where,
    });
  }
}
