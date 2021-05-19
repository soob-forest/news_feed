import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { School } from '../entities/schools.entity';

@InputType()
export class CreateSchoolInput extends PickType(School, ['name', 'address']) {}

@ObjectType()
export class CreateSchoolOutput extends OutputDto {
  @Field((type) => Number, { nullable: true })
  schoolId?: number;
}
