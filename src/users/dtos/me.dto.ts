import { Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@ObjectType()
export class MeOutput extends OutputDto {
  @Field((type) => User, { nullable: true })
  user?: User;
}
