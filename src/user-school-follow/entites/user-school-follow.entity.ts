import { Field } from '@nestjs/graphql';
import { IsBoolean, IsDate } from 'class-validator';
import { truncateSync } from 'fs';
import { CoreEntity } from 'src/common/entities/core.entity';
import { School } from 'src/schools/entities/schools.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('user_school_uniq', ['user', 'school'])
export class UserSchoolFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  startDatetime?: Date;

  @Column({ nullable: true })
  @IsDate()
  cancelDatetime?: Date;

  @Column({ default: false })
  @IsBoolean()
  isCancel?: boolean;

  @ManyToOne((type) => User, (user) => user.userSchoolFollow, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @ManyToOne((type) => School, (school) => school.userSchoolFollow, {
    onDelete: 'CASCADE',
  })
  school?: School;

  cancel() {
    this.isCancel = true;
    this.cancelDatetime = new Date();
  }

  reFollow() {
    this.isCancel = false;
    this.cancelDatetime = null;
  }
}
