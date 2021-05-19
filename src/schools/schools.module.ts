import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { School } from './entities/schools.entity';
import { SchoolResolver } from './school.resolver';
import { SchoolService } from './school.service';

@Module({
  imports: [TypeOrmModule.forFeature([School, UserSchoolManage])],
  providers: [SchoolResolver, SchoolService],
})
export class SchoolsModule {}
