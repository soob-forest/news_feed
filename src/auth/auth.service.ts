import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(userId: number) {
    return this.jwtService.sign({ id: userId });
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
