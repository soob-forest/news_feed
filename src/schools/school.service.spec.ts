import { Test } from '@nestjs/testing';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { News } from 'src/news/entites/news.entity';
import { School } from 'src/schools/entities/schools.entity';
import { SchoolService } from 'src/schools/school.service';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { User } from 'src/users/entities/users.entity';
import { Connection, Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
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
  let newsRepository: MockRepository<News>;
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
          provide: getRepositoryToken(News),
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
    newsRepository = module.get(getRepositoryToken(News));
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
    const schoolArgs = { name: '?????????', address: '??????' };

    it('should fail if school exists', async () => {
      schoolRepository.findOne.mockResolvedValue({
        id: 1,
        name: '?????????',
        address: '??????',
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
      name: '?????????',
      address: '???????????????',
    };

    const updatedSchoolArgs = {
      schoolId: 1,
      name: '?????????',
      address: '???????????????',
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
  describe('deleteSchool', () => {
    const deleteSchoolArg = {
      schoolId: 1,
    };

    it('should delete a school', async () => {
      schoolRepository.delete.mockResolvedValue(null);
      const result = await service.deleteSchool(deleteSchoolArg);
      expect(result).toMatchObject({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      schoolRepository.delete.mockRejectedValue(new Error());

      const result = await service.deleteSchool(deleteSchoolArg);

      expect(result).toMatchObject({
        ok: false,
        error: "Can't delete school",
      });
    });
  });

  describe('findByNews', () => {
    const news = [
      {
        id: 1,
        title: 'title1',
        content: 'content1',
      },
      {
        id: 2,
        title: 'title2',
        content: 'content2',
      },
    ];

    const school = new School();

    it('should get news', async () => {
      newsRepository.find.mockResolvedValue(news);
      const result = await service.findNews(school, { page: 0 });
      expect(result).toMatchObject({
        ok: true,
        news,
      });
    });

    it('should fail on exception', async () => {
      newsRepository.find.mockRejectedValue(new Error());

      const result = await service.findNews(school, { page: 0 });

      expect(result).toMatchObject({
        ok: false,
        error: "Can't find news",
      });
    });
  });
});
