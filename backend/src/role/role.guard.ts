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
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: { roles: true },
      });

      if (!user || !user.roles)
        throw new ForbiddenException('User not found or has no role');

      const userRole = user.roles.name as Role;

      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException('Access denied');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
