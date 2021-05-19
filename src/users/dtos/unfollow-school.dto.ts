import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';

@InputType()
export class UnFollowSchoolInput {
  @Field((type) => Number)
  schoolId?: number;
}

@ObjectType()
export class UnFollowSchoolOutput extends OutputDto {}
