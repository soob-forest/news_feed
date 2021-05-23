import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { CreateSchoolInput } from './create-school.dto';

@InputType()
export class UpdateSchoolInput extends PartialType(CreateSchoolInput) {
  @Field((type) => Number)
  schoolId: number;
}

@ObjectType()
export class UpdateSchoolOutput extends OutputDto {
  @Field((type) => Number, { nullable: true })
  schoolId?: number;
}
