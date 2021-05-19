import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { School } from '../entities/schools.entity';

@ArgsType()
export class SchoolInput {
  @Field((type) => Number)
  schoolId: number;
}
@ObjectType()
export class SchoolOutput extends OutputDto {
  @Field((type) => School, { nullable: true })
  school?: School;
}
