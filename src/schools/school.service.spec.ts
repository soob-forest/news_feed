import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { School } from 'src/schools/entities/schools.entity';
import { SchoolService } from 'src/schools/school.service';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn().mockReturnThis(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SchoolService', () => {
  let service: SchoolService;
  let schoolRepository: MockRepository<School>;
  let userSchoolManageRepository: MockRepository<UserSchoolManage>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SchoolService,
        {
          provide: getRepositoryToken(School),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserSchoolManage),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<SchoolService>(SchoolService);
    schoolRepository = module.get(getRepositoryToken(School));
    userSchoolManageRepository = module.get(
      getRepositoryToken(UserSchoolManage),
    );
  });

  it.todo('findById', () => {});
  it.todo('createSchool', () => {});
  it.todo('updateSchool', () => {});
  it.todo('deleteSchool', () => {});
});
