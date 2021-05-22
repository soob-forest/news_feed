import { Test } from '@nestjs/testing';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { School } from 'src/schools/entities/schools.entity';
import { SchoolService } from 'src/schools/school.service';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { User } from 'src/users/entities/users.entity';
import { Connection, Repository } from 'typeorm';

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

const mockConnection = () => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  },
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  createQueryRunner: jest.fn().mockReturnThis(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

describe('SchoolService', () => {
  let service: SchoolService;
  let schoolRepository: MockRepository<School>;
  let userSchoolManageRepository: MockRepository<UserSchoolManage>;
  let connection: MockConnection;

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
        {
          provide: getConnectionToken(),
          useValue: mockConnection(),
        },
      ],
    }).compile();
    service = module.get<SchoolService>(SchoolService);
    schoolRepository = module.get(getRepositoryToken(School));
    userSchoolManageRepository = module.get(
      getRepositoryToken(UserSchoolManage),
    );
    connection = module.get(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing school', async () => {
      schoolRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(findByIdArgs.id);
      expect(result).toEqual({ ok: true, school: findByIdArgs });
    });

    it('should fail if no school is found', async () => {
      schoolRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'School Not Found' });
    });
  });
  describe('createSchool', () => {
    const user = new User();
    const schoolArgs = { name: '삼일초', address: '울산' };

    it('should fail if school exists', async () => {
      schoolRepository.findOne.mockResolvedValue({
        id: 1,
        name: '삼일초',
        address: '울산',
      });

      const result = await service.createSchool(user, schoolArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'There is school already',
      });
    });

    it('should create a new school', async () => {
      schoolRepository.findOne.mockResolvedValue(null);

      schoolRepository.create.mockReturnValue({ id: 1, ...schoolArgs });

      const queryRunner = connection.createQueryRunner();

      queryRunner.manager.save.mockResolvedValue({ id: 1, ...schoolArgs });

      const result = await service.createSchool(user, schoolArgs);

      expect(result).toMatchObject({
        ok: true,
        schoolId: 1,
      });
    });

    it('should fail on exception', async () => {
      schoolRepository.findOne.mockRejectedValue(new Error());

      const result = await service.createSchool(user, schoolArgs);

      expect(result).toMatchObject({
        ok: false,
        error: "Can't create school",
      });
    });
  });
  describe('updateSchool', () => {
    const school = {
      id: 1,
      name: '삼일초',
      address: '울산광역시',
    };

    const updatedSchoolArgs = {
      schoolId: 1,
      name: '울산초',
      address: '울산광역시',
    };
    it('should fail if school not exists', async () => {
      schoolRepository.findOne.mockResolvedValue(null);

      const result = await service.updateSchool(updatedSchoolArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is no school',
      });
    });

    it('should update a school', async () => {
      schoolRepository.findOne.mockResolvedValue(school);

      const result = await service.updateSchool(updatedSchoolArgs);
      expect(result).toMatchObject({
        ok: true,
        schoolId: updatedSchoolArgs.schoolId,
      });
    });

    it('should fail on exception', async () => {
      schoolRepository.findOne.mockRejectedValue(new Error());

      const result = await service.updateSchool(updatedSchoolArgs);

      expect(result).toMatchObject({
        ok: false,
        error: "Can't update school",
      });
    });
  });
  it.todo('deleteSchool');
});
