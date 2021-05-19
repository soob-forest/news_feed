import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteSchoolInput {
  @Field((type) => Number)
  schoolId: number;
}

@ObjectType()
export class DeleteSchoolOutput extends OutputDto {}
