import { Test, TestingModule } from '@nestjs/testing';
import { CashbackController } from '../cashback.controller';
import { CashbackTransactions } from '../cashbackTransaction.service';
import { CashbackStorage } from '../cashbackStorage.service';
import { CashBackDto } from '../dto/cashBack.dto';


describe('CashbackController', () => {
  let controller: CashbackController;
  let cashbackTransactions: CashbackTransactions;
  let cashbackStorage: CashbackStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashbackController],
      providers: [
        {
          provide: CashbackTransactions,
          useValue: {
            getCashBackToBalance: jest.fn(),
          },
        },
        {
          provide: CashbackStorage,
          useValue: {
            getBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CashbackController>(CashbackController);
    cashbackTransactions =
      module.get<CashbackTransactions>(CashbackTransactions);
    cashbackStorage = module.get<CashbackStorage>(CashbackStorage);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCashBack', () => {
    it('should call getCashBackToBalance with correct parameters', async () => {
      const dto: CashBackDto = {
        user_id: 1,
        amount: 100,
      };

      const result = 'Transaction Succesfull';
      jest
        .spyOn(cashbackTransactions, 'getCashBackToBalance')
        .mockResolvedValue(result);

      const response = await controller.getCashBack(dto);

      expect(response).toBe(result);
      expect(cashbackTransactions.getCashBackToBalance).toHaveBeenCalledWith(
        dto,
      );
    });
  });

  describe('getBalance', () => {
    it('should call getBalance with correct parameters', async () => {
      const id = 1;
      const balance = 200;

      jest.spyOn(cashbackStorage, 'getBalance').mockResolvedValue(balance);

      const response = await controller.getBalance(id);

      expect(response).toBe(balance);
      expect(cashbackStorage.getBalance).toHaveBeenCalledWith(id);
    });
  });
});
