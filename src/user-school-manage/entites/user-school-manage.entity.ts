import { Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { School } from 'src/schools/entities/schools.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSchoolManage {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.userSchoolFollow, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @ManyToOne((type) => School, (school) => school.userSchoolFollow, {
    onDelete: 'CASCADE',
  })
  school?: School;
}
