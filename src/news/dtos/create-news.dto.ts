import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/dtos/output.dto';
import { News } from '../entites/news.entity';

@InputType()
export class CreateNewsInput extends PickType(News, ['title', 'content']) {
  @Field((type) => Number)
  schoolId: number;
}

@ObjectType()
export class CreateNewsOutput extends OutputDto {
  @Field((type) => Number, { nullable: true })
  newsId?: number;
}
