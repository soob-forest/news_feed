import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { School } from 'src/schools/entities/schools.entity';
import { SchoolService } from 'src/schools/school.service';
import { SchoolsModule } from 'src/schools/schools.module';
import { Repository } from 'typeorm';
import { News } from './entites/news.entity';
import { NewsService } from './news.service';

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

const mockSchoolService = () => ({
  findById: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: MockRepository<News>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: SchoolService, useValue: mockSchoolService() },
        {
          provide: getRepositoryToken(News),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<NewsService>(NewsService);
    newsRepository = module.get(getRepositoryToken(News));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('findById');
  it.todo('createNews');
  it.todo('updateNews');
  it.todo('deleteNews');
});
