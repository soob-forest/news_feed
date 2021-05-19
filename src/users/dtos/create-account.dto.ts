import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput extends OutputDto {}
