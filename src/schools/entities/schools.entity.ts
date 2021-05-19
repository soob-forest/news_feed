import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsEmail } from 'class-validator';
import { News } from 'src/news/entites/news.entity';
import { User } from 'src/users/entities/users.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { UserSchoolFollow } from 'src/user-school-follow/entites/user-school-follow.entity';

@InputType('SchoolInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class School extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  address: string;

  @OneToMany((type) => News, (news) => news.school)
  @Field((type) => [News])
  news: News[];

  @OneToMany(
    (type) => UserSchoolManage,
    (userSchoolManage) => userSchoolManage.school,
  )
  userSchoolManage: UserSchoolManage[];

  @OneToMany(
    (type) => UserSchoolFollow,
    (userSchoolFollow) => userSchoolFollow.school,
  )
  userSchoolFollow: UserSchoolFollow[];

  managers: User[];
  followers: User[];
}
