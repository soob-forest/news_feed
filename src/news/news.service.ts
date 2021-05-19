import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolService } from 'src/schools/school.service';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateNewsInput } from './dtos/create-news.dto';
import { News } from './entites/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly news: Repository<News>,
    private readonly schoolService: SchoolService,
  ) {}

  async createNews(user: User, { schoolId, title, content }: CreateNewsInput) {
    try {
      const { school } = await this.schoolService.findById(schoolId);

      if (!school) {
        return { ok: false, error: 'There is no school' };
      }

      const news = await this.news.save(
        this.news.create({ school, user, title, content }),
      );

      return {
        ok: true,
        newsId: news.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't create school",
      };
    }
  }
}
