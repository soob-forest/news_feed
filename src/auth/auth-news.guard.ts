import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NewsService } from 'src/news/news.service';

@Injectable()
export class NewsGuard implements CanActivate {
  constructor(private readonly newsService: NewsService) {}
  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { input } = GqlExecutionContext.create(context).getArgs();
    const user = gqlContext.user;

    const { news } = await this.newsService.findById(input.newsId);

    return news.user.id === user.id;
  }
}
