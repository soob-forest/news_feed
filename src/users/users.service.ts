import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/news/entites/news.entity';
import { School } from 'src/schools/entities/schools.entity';
import { UserSchoolFollow } from 'src/user-school-follow/entites/user-school-follow.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { Repository } from 'typeorm';
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
import {
  UnFollowSchoolInput,
  UnFollowSchoolOutput,
} from './dtos/unfollow-school.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { NewsFeedsOutput } from './dtos/news.dto';

import { User } from './entities/users.entity';
import { ManagingSchoolOutput } from './dtos/managing-school.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserSchoolManage)
    private readonly userSchoolManage: Repository<UserSchoolManage>,
    @InjectRepository(UserSchoolFollow)
    private readonly userSchoolFollow: Repository<UserSchoolFollow>,
    @InjectRepository(School) private readonly school: Repository<School>,
    @InjectRepository(News) private readonly news: Repository<News>,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'There is email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = await this.jwtService.sign({ id: user.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't log user in.",
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async isManagingSchool({ userId, schoolId }): Promise<boolean> {
    const exists = await this.userSchoolManage
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .andWhere('schoolId= :schoolId', { schoolId })
      .getOne();

    return exists ? true : false;
  }

  async followSchool(
    user: User,
    { schoolId }: FollowSchoolInput,
  ): Promise<FollowSchoolOutput> {
    try {
      const school = await this.school.findOne({ id: schoolId });

      if (!school) {
        return { ok: false, error: 'There is no school' };
      }

      const exists = await this.userSchoolFollow.findOne({ user, school });
      if (exists) {
        exists.reFollow();
        await this.userSchoolFollow.save(exists);
        return {
          ok: true,
        };
      }

      await this.userSchoolFollow.save(
        this.userSchoolFollow.create({ user, school }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: "Can't follow school" };
    }
  }

  async unFollowSchool(
    user: User,
    { schoolId }: UnFollowSchoolInput,
  ): Promise<UnFollowSchoolOutput> {
    try {
      const school = await this.school.findOne({ id: schoolId });
      if (!school) {
        return { ok: false, error: 'There is no school' };
      }

      const follow = await this.userSchoolFollow.findOne({ user, school });

      if (!follow) {
        return { ok: false, error: 'Not found follow' };
      }

      follow.cancel();
      await this.userSchoolFollow.save(follow);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: "Can't unFollow school" };
    }
  }

  async findFollowingSchools(user: User): Promise<FollowingSchoolOutput> {
    try {
      const schools = await this.school
        .createQueryBuilder('school')
        .leftJoin('school.userSchoolFollow', 'userSchoolFollow')
        .where('userSchoolFollow.userId = :userId', { userId: user.id })
        .andWhere('userSchoolFollow.isCancel = :isCancel', { isCancel: false })
        .getMany();

      return {
        ok: true,
        schools,
      };
    } catch (error) {
      return { ok: false, error: "Can't find Follwing Schools" };
    }
  }

  async findManagingSchools(user: User): Promise<ManagingSchoolOutput> {
    try {
      const schools = await this.school
        .createQueryBuilder('school')
        .leftJoin('school.userSchoolManage', 'userSchoolManage')
        .where('userSchoolManage.userId = :userId', { userId: user.id })
        .getMany();

      return {
        ok: true,
        schools,
      };
    } catch (error) {
      return { ok: false, error: "Can't find Managing Schools" };
    }
  }

  async findNewsFeeds(user: User, { page }): Promise<NewsFeedsOutput> {
    try {
      const news = await this.news
        .createQueryBuilder('news')
        .leftJoin('news.school', 'school')
        .leftJoin('school.userSchoolFollow', 'userSchoolFollow')
        .where('userSchoolFollow.userId = :userId', { userId: user.id })
        .andWhere('userSchoolFollow.startDatetime <= news.CreatedAt')
        .andWhere(
          'IF( userSchoolFollow.cancelDatetime IS NOT NULL, userSchoolFollow.cancelDatetime > news.CreatedAt, true)',
        )
        .orderBy('news.createdAt', 'DESC')
        .take(30)
        .skip(page * 30)
        .getMany();

      return {
        ok: true,
        news,
      };
    } catch (error) {
      return { ok: false, error: "Cat't Find News Feeds" };
    }
  }
}
