import { Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { School } from 'src/schools/entities/schools.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserSchoolManage extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.userSchoolFollow)
  @Field((type) => User, { nullable: true })
  user?: User;

  @ManyToOne((type) => School, (school) => school.userSchoolFollow)
  @Field((type) => School, { nullable: true })
  school?: School;
}
