import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { News } from '../entites/news.entity';

@ArgsType()
export class NewsInput {
  @Field((type) => Number)
  newsId: number;
}
@ObjectType()
export class NewsOutput extends OutputDto {
  @Field((type) => News, { nullable: true })
  news?: News;
}
