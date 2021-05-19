import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { School } from 'src/schools/entities/schools.entity';

@InputType('SchoolInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class News extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field((type) => String)
  @IsString()
  content: string;

  @ManyToOne((type) => School, (school) => school.news)
  @Field((type) => School, { nullable: true })
  school?: School;
}
