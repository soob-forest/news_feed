import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { User } from 'src/users/entities/users.entity';
import { Connection, Repository } from 'typeorm';
import {
  CreateSchoolInput,
  CreateSchoolOutput,
} from './dtos/create-school.dto';
import {
  UpdateSchoolInput,
  UpdateSchoolOutput,
} from './dtos/update-school.dto';
import { School } from './entities/schools.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private readonly school: Repository<School>,
    @InjectRepository(UserSchoolManage)
    private readonly userSchoolManage: Repository<UserSchoolManage>,
    private readonly connection: Connection,
  ) {}

  async createSchool(
    user: User,
    { name, address }: CreateSchoolInput,
  ): Promise<CreateSchoolOutput> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exists = await this.school.findOne({ name, address });

      if (exists) {
        return { ok: false, error: 'There is school already' };
      }

      const school = await queryRunner.manager.save(
        this.school.create({ name, address }),
      );
      await queryRunner.manager.save(
        this.userSchoolManage.create({ user, school }),
      );

      await queryRunner.commitTransaction();

      return {
        ok: true,
        schoolId: school.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        error: "Can't create school",
      };
    } finally {
      await queryRunner.release();
    }
  }

  async updateSchool(
    user: User,
    updateSchoolInput: UpdateSchoolInput,
  ): Promise<UpdateSchoolOutput> {
    try {
      const school = await this.school.findOne({
        id: updateSchoolInput.schoolId,
      });

      await this.school.save({
        id: school.id,
        ...updateSchoolInput,
      });

      return {
        schoolId: school.id,
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't update school",
      };
    }
  }
}
