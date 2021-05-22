import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { School } from 'src/schools/entities/schools.entity';
import { SchoolService } from 'src/schools/school.service';
import { SchoolsModule } from 'src/schools/schools.module';
import { User } from 'src/users/entities/users.entity';
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

type MockSchoolService = Partial<Record<keyof SchoolService, jest.Mock>>;

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: MockRepository<News>;
  let schoolService: MockSchoolService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useValue: mockRepository(),
        },
        { provide: SchoolService, useValue: mockSchoolService() },
      ],
    }).compile();
    service = module.get<NewsService>(NewsService);
    schoolService = module.get(SchoolService);
    newsRepository = module.get(getRepositoryToken(News));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing news', async () => {
      newsRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(findByIdArgs.id);
      expect(result).toEqual({ ok: true, news: findByIdArgs });
    });

    it('should fail if no news is found', async () => {
      newsRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'News Not Found' });
    });
  });
  describe('createNews', () => {
    const user = new User();
    const createNewsArgs = { schoolId: 1, title: 'title', content: 'content' };

    it('should fail if school not exists', async () => {
      schoolService.findById.mockResolvedValue({
        ok: false,
        error: "Can't create school",
      });

      const result = await service.createNews(user, createNewsArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'There is no school',
      });
    });

    it('should create a news', async () => {
      schoolService.findById.mockResolvedValue({ school: { id: 1 } });

      newsRepository.create.mockReturnValue(createNewsArgs);

      newsRepository.save.mockResolvedValue({ id: 1, ...createNewsArgs });

      const result = await service.createNews(user, createNewsArgs);

      expect(result).toMatchObject({
        ok: true,
        newsId: 1,
      });
    });

    it('should fail on exception ', async () => {
      schoolService.findById.mockRejectedValue(new Error());
      const result = await service.createNews(user, createNewsArgs);
      expect(result).toEqual({ ok: false, error: "Can't create school" });
    });
  });
  describe('updateNews', () => {
    const news = {
      id: 1,
      title: 'title',
      content: 'content',
    };

    const updatedNewsArgs = {
      newsId: 1,
      title: 'title',
      content: 'updated content',
    };

    it('should fail if news not exists', async () => {
      newsRepository.findOne.mockResolvedValue(null);

      const result = await service.updateNews(updatedNewsArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'not found news',
      });
    });

    it('should update a news', async () => {
      newsRepository.findOne.mockResolvedValue(news);

      const result = await service.updateNews(updatedNewsArgs);
      expect(result).toMatchObject({
        ok: true,
        newsId: updatedNewsArgs.newsId,
      });
    });

    it('should fail on exception ', async () => {
      newsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.updateNews(updatedNewsArgs);
      expect(result).toEqual({ ok: false, error: "Can't update news" });
    });
  });
  it.todo('deleteNews');
});
