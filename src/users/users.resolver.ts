import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserRole } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { News } from 'src/news/entites/news.entity';
import { School } from 'src/schools/entities/schools.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  FollowSchoolInput,
  FollowSchoolOutput,
} from './dtos/follow-school.dto';
import { FollowingSchoolOutput } from './dtos/following-school.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { MeOutput } from './dtos/me.dto';
import {
  UnFollowSchoolInput,
  UnFollowSchoolOutput,
} from './dtos/unfollow-school.dto';
import { User } from './entities/users.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => MeOutput)
  @UserRole(['ANY'])
  me(@AuthUser() user: User): MeOutput {
    return {
      ok: true,
      user: user,
    };
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Mutation((returns) => FollowSchoolOutput)
  @UserRole(['STUDENT'])
  async followSchool(
    @Args('input') followSchoolInput: FollowSchoolInput,
    @AuthUser() user: User,
  ): Promise<FollowSchoolOutput> {
    return this.userService.followSchool(user, followSchoolInput);
  }

  @Mutation((returns) => FollowSchoolOutput)
  @UserRole(['STUDENT'])
  async unFollowSchool(
    @Args('input') unFollowSchoolInput: UnFollowSchoolInput,
    @AuthUser() user: User,
  ): Promise<UnFollowSchoolOutput> {
    return this.userService.unFollowSchool(user, unFollowSchoolInput);
  }

  @ResolveField()
  async followingSchools(@Parent() user: User): Promise<School[]> {
    const { schools } = await this.userService.findFollowingSchools(user);
    return schools;
  }

  @ResolveField()
  async newsFeeds(
    @Parent() user: User,
    @Args('page', { nullable: true }) page: Number = 0,
  ): Promise<News[]> {
    const { news } = await this.userService.findNewsFeeds(user, {
      page,
    });
    return news;
  }

  @ResolveField()
  async managingSchools(@Parent() user: User): Promise<School[]> {
    const { schools } = await this.userService.findManagingSchools(user);
    return schools;
  }
}
