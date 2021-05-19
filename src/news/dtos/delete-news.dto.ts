import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteNewsInput {
  @Field((type) => Number)
  newsId: number;
}

@ObjectType()
export class DeleteNewsOutput extends OutputDto {}
