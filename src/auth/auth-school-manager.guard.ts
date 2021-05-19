import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/users/users.service';

@Injectable()
export class SchoolManagerGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { input } = GqlExecutionContext.create(context).getArgs();
    const user = gqlContext.user;

    return await this.userService.isManagingSchool({
      userId: user.id,
      schoolId: input.schoolId,
    });
  }
}
