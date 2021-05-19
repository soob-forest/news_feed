import {
  ObjectType,
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsEmail } from 'class-validator';
import { School } from 'src/schools/entities/schools.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { UserSchoolFollow } from 'src/user-school-follow/entites/user-school-follow.entity';

export enum Role {
  MANAGER = 'MANAGER',
  STUDENT = 'STUDENT',
}

registerEnumType(Role, { name: 'Role' });

@InputType('UsersInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  @IsString()
  password: string;

  @Column()
  @Field((type) => Role)
  @IsEnum(Role)
  role: Role;

  @OneToMany(
    (type) => UserSchoolManage,
    (userSchoolManage) => userSchoolManage.user,
  )
  userSchoolManage: UserSchoolManage[];

  @OneToMany(
    (type) => UserSchoolFollow,
    (userSchoolFollow) => userSchoolFollow.user,
  )
  userSchoolFollow: UserSchoolFollow[];
}
