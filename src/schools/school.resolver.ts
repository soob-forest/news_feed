import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserRole } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  CreateSchoolInput,
  CreateSchoolOutput,
} from './dtos/create-school.dto';
import { School } from './entities/schools.entity';
import { SchoolService } from './school.service';

@Resolver((of) => School)
export class SchoolResolver {
  constructor(private readonly schoolService: SchoolService) {}

  @Mutation((returns) => CreateSchoolOutput)
  @UserRole(['MANAGER'])
  async createSchool(
    @Args('input') createSchoolInput: CreateSchoolInput,
    @AuthUser() user: User,
  ): Promise<CreateSchoolOutput> {
    return this.schoolService.createSchool(user, createSchoolInput);
  }
}
