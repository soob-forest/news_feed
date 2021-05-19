import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
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
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  UnFollowSchoolInput,
  UnFollowSchoolOutput,
} from './dtos/unfollow-school.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserSchoolManage)
    private readonly userSchoolManage: Repository<UserSchoolManage>,
    @InjectRepository(UserSchoolFollow)
    private readonly userSchoolFollow: Repository<UserSchoolFollow>,
    @InjectRepository(School) private readonly school: Repository<School>,
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
      const school = await this.school.findOneOrFail({ id: schoolId });

      if (!school) {
        return { ok: false, error: 'There is no school' };
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
}
