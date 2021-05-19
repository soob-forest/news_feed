import { Field } from '@nestjs/graphql';
import { IsBoolean, IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { School } from 'src/schools/entities/schools.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSchoolFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  startDatetime?: Date;

  @Column()
  @IsDate()
  cancelDatetime?: Date;

  @Column()
  @IsBoolean()
  isCancel?: boolean;

  @ManyToOne((type) => User, (user) => user.userSchoolFollow)
  user?: User;

  @ManyToOne((type) => School, (school) => school.userSchoolFollow)
  school?: School;
}
