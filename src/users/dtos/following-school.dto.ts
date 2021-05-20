import { Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { School } from 'src/schools/entities/schools.entity';

@ObjectType()
export class FollowingSchoolOutput extends OutputDto {
  @Field((type) => [School], { nullable: true })
  schools?: School[];
}
