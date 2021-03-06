import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/news/entites/news.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { UsersModule } from 'src/users/users.module';
import { School } from './entities/schools.entity';
import { SchoolResolver } from './school.resolver';
import { SchoolService } from './school.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, UserSchoolManage, News]),
    UsersModule,
  ],
  providers: [SchoolResolver, SchoolService],
  exports: [SchoolService],
})
export class SchoolsModule {}
