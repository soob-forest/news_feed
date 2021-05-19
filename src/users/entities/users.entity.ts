import {
  ObjectType,
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';
import { IsString, IsEnum, IsEmail } from 'class-validator';

export enum Role {
  MANAGER = 'MANAGER',
  STUDENT = 'STUDENT',
}

registerEnumType(Role, { name: 'Role' });

@InputType('UsersInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Users extends CoreEntity {
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
}
