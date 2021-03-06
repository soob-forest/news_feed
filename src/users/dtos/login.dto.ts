import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends OutputDto {
  @Field((type) => String, { nullable: true })
  token?: string;
}
