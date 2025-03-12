import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { Role } from './role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем требуемые роли из декоратора @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // Если роли не заданы, доступ открыт

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];

    try {
      // Декодируем токен и получаем ID пользователя
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      // Ищем пользователя в базе и загружаем его единственную роль
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: { roles: true }, // У пользователя должна быть связь role (role: { name: 'Admin' })
      });

      if (!user || !user.roles)
        throw new ForbiddenException('User not found or has no role');

      // Получаем роль пользователя
      const userRole = user.roles.name as Role;

      // Проверяем, соответствует ли его роль требуемым
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException('Access denied');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
