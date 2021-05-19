import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { CreateNewsInput } from './create-news.dto';

@InputType()
export class UpdateNewsInput extends PartialType(CreateNewsInput) {
  @Field((type) => Number)
  newsId: number;
}

@ObjectType()
export class UpdateNewsOutput extends OutputDto {
  @Field((type) => Number, { nullable: true })
  newsId?: number;
}
