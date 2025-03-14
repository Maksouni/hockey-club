import { ConflictException, Injectable } from '@nestjs/common';
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
}
