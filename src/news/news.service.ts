import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolService } from 'src/schools/school.service';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateNewsInput } from './dtos/create-news.dto';
import { DeleteNewsInput, DeleteNewsOutput } from './dtos/delete-news.dto';
import { NewsOutput } from './dtos/news.dto';
import { UpdateNewsInput, UpdateNewsOutput } from './dtos/update-news.dto';
import { News } from './entites/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly news: Repository<News>,
    private readonly schoolService: SchoolService,
  ) {}

  async findById(id: number): Promise<NewsOutput> {
    try {
      const news = await this.news.findOneOrFail(id, { relations: ['user'] });
      return {
        ok: true,
        news,
      };
    } catch (error) {
      return { ok: false, error: 'News Not Found' };
    }
  }

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

  async updateNews(
    updateNewsInput: UpdateNewsInput,
  ): Promise<UpdateNewsOutput> {
    try {
      const news = await this.news.findOne({
        id: updateNewsInput.newsId,
      });
      if (!news)
        return {
          ok: false,
          error: 'not found news',
        };
      await this.news.save({
        id: news.id,
        ...updateNewsInput,
      });
      return {
        newsId: news.id,
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't update news",
      };
    }
  }

  async deleteNews({ newsId }: DeleteNewsInput): Promise<DeleteNewsOutput> {
    try {
      const news = await this.news.findOne({
        id: newsId,
      });
      if (!news)
        return {
          ok: false,
          error: 'not found news',
        };
      await this.news.delete({
        id: news.id,
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't delete news",
      };
    }
  }
}
