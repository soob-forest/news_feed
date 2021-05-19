import { Field } from '@nestjs/graphql';
import { IsBoolean, IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { School } from 'src/schools/entities/schools.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserSchoolFollow extends CoreEntity {
  @Column()
  @Field((type) => String, { nullable: true })
  @IsDate()
  startDatetime?: Date;

  @Column()
  @Field((type) => String, { nullable: true })
  @IsDate()
  cancelDatetime?: Date;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @IsBoolean()
  isCancel?: boolean;

  @ManyToOne((type) => User, (user) => user.userSchoolFollow)
  @Field((type) => User, { nullable: true })
  user?: User;

  @ManyToOne((type) => School, (school) => school.userSchoolFollow)
  @Field((type) => School, { nullable: true })
  school?: School;
}
