import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './user.model';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get(getModelToken(User));
  });

  describe('getUserbyEmail', () => {
    it('should return the user with the given email', async () => {
      const email = 'test@example.com';
      const expectedUser = { id: 1, email };

      userRepository.findOne.mockResolvedValueOnce(expectedUser);

      const result = await usersService.getUserbyEmail(email);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toBeCalledWith({
        where: { email },
        include: { all: true },
      });
    });
  });

  describe('getUserById', () => {
    it('should return the user with the given ID', async () => {
      const userId = 1;
      const expectedUser = { id: userId, email: 'test@example.com' };

      userRepository.findByPk.mockResolvedValueOnce(expectedUser);

      const result = await usersService.getUserById(userId);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findByPk).toBeCalledWith(userId);
    });
  });
});
