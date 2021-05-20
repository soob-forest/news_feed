import { Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { News } from 'src/news/entites/news.entity';

@ObjectType()
export class NewsFeedsOutput extends OutputDto {
  @Field((type) => [News], { nullable: true })
  news?: News[];
}
