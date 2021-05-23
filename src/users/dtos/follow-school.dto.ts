import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';

@InputType()
export class FollowSchoolInput {
  @Field((type) => Number)
  schoolId?: number;
}

@ObjectType()
export class FollowSchoolOutput extends OutputDto {}
