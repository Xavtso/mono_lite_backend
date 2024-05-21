import { Sequelize } from 'sequelize-typescript';
import { Test, TestingModule } from '@nestjs/testing';
import { DepositsController } from '../deposits.controller';
import { DepositsService } from '../deposits.service';
import { createDepositDto } from '../dto/createDeposit.dto';
import { Deposit } from '../deposit.model';

describe('DepositsController', () => {
  let controller: DepositsController;
  let service: DepositsService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: 'localhost',
      database: 'mono_db',
      username: 'postgres',
      password: 'vh2004r44',
      port: 5432,
      logging: false,
    });
    sequelize.addModels([Deposit]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositsController],
      providers: [
        DepositsService,
        {
          provide: DepositsService,
          useValue: {
            createDeposit: jest.fn(),
            updateAmountOfDeposit: jest.fn(),
            showUserVaults: jest.fn(),
            destroyVault: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DepositsController>(DepositsController);
    service = module.get<DepositsService>(DepositsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDeposit', () => {
    it('should create a deposit', async () => {
      const dto: createDepositDto = {
        user_id: 1,
        amount: 1000,
        id: 0,
        interest_rate: 0,
        term: 0,
      };
      const result = 'Deposit created!';
      jest.spyOn(service, 'createDeposit').mockResolvedValue(result);

      const response = await controller.createDeposit(dto);

      expect(response).toBe(result);
      expect(service.createDeposit).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateAmountOfDeposit', () => {
    it('should update the amount of a deposit', async () => {
      const dto: createDepositDto = {
        user_id: 1,
        amount: 1500,
        id: 0,
        interest_rate: 0,
        term: 0,
      };
      const result = 'Deposit updated!';
      jest.spyOn(service, 'updateAmountOfDeposit').mockResolvedValue(result);

      const response = await controller.updateAmountOfDeposit(dto);

      expect(response).toBe(result);
      expect(service.updateAmountOfDeposit).toHaveBeenCalledWith(dto);
    });
  });

  describe('showUserVaults', () => {
    it('should return user deposits', async () => {
      const id = 1;
      const deposits = [new Deposit(), new Deposit()];
      jest.spyOn(service, 'showUserVaults').mockResolvedValue(deposits);

      const response = await controller.showUserVaults(id);

      expect(response).toBe(deposits);
      expect(service.showUserVaults).toHaveBeenCalledWith(id);
    });
  });

  describe('destroyVault', () => {
    it('should destroy a deposit', async () => {
      const dto: createDepositDto = {
        user_id: 1,
        amount: 0,
        id: 0,
        interest_rate: 0,
        term: 0,
      };
      const result = 'Deposit vault destroyed!';
      jest.spyOn(service, 'destroyVault').mockResolvedValue(result);

      const response = await controller.destroyVault(dto);

      expect(response).toBe(result);
      expect(service.destroyVault).toHaveBeenCalledWith(dto);
    });
  });
});
