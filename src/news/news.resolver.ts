import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserRole } from 'src/auth/auth-role.decorator';
import { SchoolManagerGuard } from 'src/auth/auth-school-manager.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import { CreateNewsInput, CreateNewsOutput } from './dtos/create-news.dto';
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
}
