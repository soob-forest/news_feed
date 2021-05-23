import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/users.entity';

export type UserRoles = keyof typeof Role | 'ANY';

export const UserRole = (userRoles: UserRoles[]) =>
  SetMetadata('userRoles', userRoles);
