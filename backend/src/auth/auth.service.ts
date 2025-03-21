import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.user({ email: email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(pass)
      .digest('hex');

    if (user.password !== hashedPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string) {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(pass)
      .digest('hex');
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      roles: {
        connect: { id: 5 },
      },
    });
    return { id: user.id, email: user.email };
  }
}
