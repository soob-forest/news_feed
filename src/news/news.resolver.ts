import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NewsGuard } from 'src/auth/auth-news.guard';
import { UserRole } from 'src/auth/auth-role.decorator';
import { SchoolManagerGuard } from 'src/auth/auth-school-manager.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import { CreateNewsInput, CreateNewsOutput } from './dtos/create-news.dto';
import { DeleteNewsInput, DeleteNewsOutput } from './dtos/delete-news.dto';
import { UpdateNewsInput, UpdateNewsOutput } from './dtos/update-news.dto';
import { News } from './entites/news.entity';
import { NewsService } from './news.service';

@Resolver((of) => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Mutation((returns) => CreateNewsOutput)
  @UserRole(['MANAGER'])
  @UseGuards(SchoolManagerGuard)
  async createNews(
    @Args('input') createNewsInput: CreateNewsInput,
    @AuthUser() user: User,
  ): Promise<CreateNewsOutput> {
    return this.newsService.createNews(user, createNewsInput);
  }

  @Mutation((returns) => UpdateNewsOutput)
  @UserRole(['MANAGER'])
  @UseGuards(NewsGuard)
  async updateNews(
    @Args('input') updateNewsInput: UpdateNewsInput,
  ): Promise<UpdateNewsOutput> {
    return this.newsService.updateNews(updateNewsInput);
  }

  @Mutation((returns) => UpdateNewsOutput)
  @UserRole(['MANAGER'])
  @UseGuards(NewsGuard)
  async deleteNews(
    @Args('input') deleteNewsInput: DeleteNewsInput,
  ): Promise<DeleteNewsOutput> {
    return this.newsService.deleteNews(deleteNewsInput);
  }
}
