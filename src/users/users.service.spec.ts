import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { News } from 'src/news/entites/news.entity';
import { School } from 'src/schools/entities/schools.entity';
import { UserSchoolFollow } from 'src/user-school-follow/entites/user-school-follow.entity';
import { UserSchoolManage } from 'src/user-school-manage/entites/user-school-manage.entity';
import { Repository } from 'typeorm';
import { Role, User } from './entities/users.entity';
import { UserService } from './users.service';

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

const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;
  let schoolRepository: MockRepository<School>;
  let userSchoolManageRepository: MockRepository<UserSchoolManage>;
  let userSchoolFollowRepository: MockRepository<UserSchoolFollow>;

  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: getRepositoryToken(UserSchoolManage),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserSchoolFollow),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(School),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(News),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User));
    schoolRepository = module.get(getRepositoryToken(School));
    userSchoolManageRepository = module.get(
      getRepositoryToken(UserSchoolManage),
    );
    userSchoolFollowRepository = module.get(
      getRepositoryToken(UserSchoolFollow),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'test@email.com',
      password: '1234',
      role: Role.STUDENT,
    };

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: '',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is email already',
      });
    });

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);

      const result = await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: "Couldn't create account" });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'test@email.com',
      password: '1234',
    };
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);

      expect(result).toEqual({ ok: true, token: 'token' });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: "Can't log user in." });
    });
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    });
  });

  describe('isManagingSchool', () => {
    const isManagingSchoolArgs = {
      userId: 1,
      schoolId: 1,
    };

    it('should true if user manage a school', async () => {
      userSchoolManageRepository
        .createQueryBuilder()
        .where('userId = :userId', { userId: isManagingSchoolArgs.userId })
        .andWhere('schoolId= :schoolId', {
          schoolId: isManagingSchoolArgs.schoolId,
        })
        .getOne.mockResolvedValue(isManagingSchoolArgs);
      const result = await service.isManagingSchool(isManagingSchoolArgs);
      expect(result).toEqual(true);
    });

    it('should false if user manage a school', async () => {
      userSchoolManageRepository
        .createQueryBuilder()
        .where()
        .andWhere()
        .getOne.mockResolvedValue(null);

      const result = await service.isManagingSchool(isManagingSchoolArgs);
      expect(result).toEqual(false);
    });
  });

  describe('followSchool', () => {
    const followSchoolArgs = {
      schoolId: 1,
    };

    it('should fail if school not exists', async () => {
      schoolRepository.findOne.mockResolvedValue(null);
      const result = await service.followSchool(new User(), followSchoolArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is no school',
      });
    });

    it('should follow a school', async () => {
      const school = {
        id: 1,
        name: 'test',
        address: '울산',
      };
      const userSchoolFollowArgs = {
        id: 1,
        isCancel: false,
      };
      schoolRepository.findOne.mockResolvedValue(school);
      userSchoolFollowRepository.create.mockReturnValue(userSchoolFollowArgs);
      userSchoolFollowRepository.save.mockResolvedValue(userSchoolFollowArgs);

      const result = await service.followSchool(new User(), followSchoolArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      schoolRepository.findOne.mockRejectedValue(new Error());
      const result = await service.followSchool(new User(), followSchoolArgs);
      expect(result).toEqual({ ok: false, error: "Can't follow school" });
    });
  });

  describe('unFollowSchool', () => {
    const unFollowSchoolArgs = {
      schoolId: 1,
    };

    it('should fail if school not exists', async () => {
      schoolRepository.findOne.mockResolvedValue(null);
      const result = await service.unFollowSchool(
        new User(),
        unFollowSchoolArgs,
      );
      expect(result).toMatchObject({
        ok: false,
        error: 'There is no school',
      });
    });

    it('should fail if follow school not exists', async () => {
      schoolRepository.findOne.mockResolvedValue(unFollowSchoolArgs);

      userSchoolFollowRepository.findOne.mockResolvedValue(null);

      const result = await service.unFollowSchool(
        new User(),
        unFollowSchoolArgs,
      );
      expect(result).toMatchObject({
        ok: false,
        error: 'Not found follow',
      });
    });

    it('should unfollow a school', async () => {
      const school = {
        id: 1,
        name: 'test',
        address: '울산',
      };
      const userSchoolFollowArgs = {
        schoolId: 1,
      };

      const userSchoolFollow = new UserSchoolFollow();
      userSchoolFollow.isCancel = false;

      schoolRepository.findOne.mockResolvedValue(school);
      userSchoolFollowRepository.findOne.mockResolvedValue(userSchoolFollow);

      const result = await service.unFollowSchool(
        new User(),
        userSchoolFollowArgs,
      );

      expect(true).toEqual(userSchoolFollow.isCancel);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      schoolRepository.findOne.mockRejectedValue(new Error());
      const result = await service.unFollowSchool(
        new User(),
        unFollowSchoolArgs,
      );
      expect(result).toEqual({ ok: false, error: "Can't unFollow school" });
    });
  });
  it.todo('findFollowingSchools');
  it.todo('findNewsFeeds');
});
