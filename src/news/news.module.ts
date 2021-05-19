import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolsModule } from 'src/schools/schools.module';
import { UsersModule } from 'src/users/users.module';
import { News } from './entites/news.entity';
import { NewsResolver } from './news.resolver';
import { NewsService } from './news.service';

@Module({
  imports: [TypeOrmModule.forFeature([News]), SchoolsModule, UsersModule],
  providers: [NewsResolver, NewsService],
})
export class NewsModule {}
