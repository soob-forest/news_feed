import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UserRole } from 'src/auth/auth-role.decorator';
import { SchoolManagerGuard } from 'src/auth/auth-school-manager.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  CreateSchoolInput,
  CreateSchoolOutput,
} from './dtos/create-school.dto';
import {
  DeleteSchoolInput,
  DeleteSchoolOutput,
} from './dtos/delete-school.dto';
import { SchoolOutput } from './dtos/school.dto';
import {
  UpdateSchoolInput,
  UpdateSchoolOutput,
} from './dtos/update-school.dto';
import { School } from './entities/schools.entity';
import { SchoolService } from './school.service';
import { News } from 'src/news/entites/news.entity';

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

  @Mutation((returns) => UpdateSchoolOutput)
  @UserRole(['MANAGER'])
  @UseGuards(SchoolManagerGuard)
  async updateSchool(
    @Args('input') updateSchoolInput: UpdateSchoolInput,
  ): Promise<UpdateSchoolOutput> {
    return this.schoolService.updateSchool(updateSchoolInput);
  }

  @Mutation((returns) => UpdateSchoolOutput)
  @UserRole(['MANAGER'])
  @UseGuards(SchoolManagerGuard)
  async deleteSchool(
    @Args('input') deleteSchoolInput: DeleteSchoolInput,
  ): Promise<DeleteSchoolOutput> {
    return this.schoolService.deleteSchool(deleteSchoolInput);
  }

  @Query((returns) => SchoolOutput)
  async school(@Args('schoolId') id: number): Promise<SchoolOutput> {
    return this.schoolService.findById(id);
  }

  @ResolveField()
  async news(
    @Parent() school: School,
    @Args('page', { nullable: true }) page: Number = 0,
  ): Promise<News[]> {
    const { news } = await this.schoolService.findNews(school, { page });
    return news;
  }
}
