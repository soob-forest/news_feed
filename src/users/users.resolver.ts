import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserRole } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  FollowSchoolInput,
  FollowSchoolOutput,
} from './dtos/follow-school.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  UnFollowSchoolInput,
  UnFollowSchoolOutput,
} from './dtos/unfollow-school.dto';
import { User } from './entities/users.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => String)
  @UserRole(['ANY'])
  userTest(@AuthUser() authUser: User) {
    return 'true';
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
}
