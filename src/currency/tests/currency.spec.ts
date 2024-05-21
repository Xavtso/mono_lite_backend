import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { CurrencyUtils } from '../currency.utils';
import { updateCurrencyBalanceDto } from '../dto/updateBalance.dto';
import { Currency } from '../currency.model';
import { UserCurrency } from '../userCurrency.model';
import { CardUtils } from '../../cards/card.utils';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { Card } from '../../cards/card.model';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let currencyService: CurrencyService;
  let utils: CurrencyUtils;
  let cardUtils: CardUtils;

  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    database: 'mono_db',
    username: 'postgres',
    password: 'vh2004r44',
    port: 5432,
  });

  // Додавання моделей до Sequelize
  sequelize.addModels([Currency, UserCurrency, User, Card]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: Sequelize,
          useValue: sequelize,
        },
        {
          provide: CurrencyService,
          useValue: {
            sendCurrencyInfo: jest.fn(),
            sellCurrency: jest.fn(),
            buyCurrency: jest.fn(),
          },
        },
        {
          provide: CurrencyUtils,
          useValue: {
            getUserEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(CurrencyService);
    utils = module.get<CurrencyUtils>(CurrencyUtils);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sellCurrency', () => {
    it('should sell currency', async () => {
      const dto: updateCurrencyBalanceDto = {
        user_id: 1,
        amount: 100,
        usd_balance: null,
        eur_balance: null,
        currencyCode: '840',
      };
      const result = 'Currency successfuly selled!';
      jest.spyOn(currencyService, 'sellCurrency').mockResolvedValue(result);

      const response = await controller.sellCurrency(dto);

      // Перевіряємо, що результат має певну відповідь
      expect(response).toEqual('Currency successfuly selled!');
      expect(currencyService.sellCurrency).toHaveBeenCalledWith(dto);
    });
  });

  describe('sellCurrency', () => {
    it('should sell currency', async () => {
      const dto: updateCurrencyBalanceDto = {
        user_id: 1,
        amount: 100,
        usd_balance: null,
        eur_balance: null,
        currencyCode: '840',
      };
      const result = 'Insuficient funds!';
      jest.spyOn(currencyService, 'sellCurrency').mockResolvedValue(result);

      const response = await controller.sellCurrency(dto);

      // Перевіряємо, що результат має певну відповідь
      expect(response).toEqual('Insuficient funds!');
      expect(currencyService.sellCurrency).toHaveBeenCalledWith(dto);
    });
  });

  describe('buyCurrency', () => {
    it('should buy currency', async () => {
      const dto: updateCurrencyBalanceDto = {
        user_id: 1,
        amount: 100,
        usd_balance: null,
        eur_balance: null,
        currencyCode: '840',
      };
      const result = 'Currency successfuly bougth!';
      jest.spyOn(currencyService, 'buyCurrency').mockResolvedValue(result);

      const response = await controller.buyCurrency(dto);

      // Перевіряємо, що результат має певну відповідь
      expect(response).toEqual('Currency successfuly bougth!');
      expect(currencyService.buyCurrency).toHaveBeenCalledWith(dto);
    });
  });

  describe('buyCurrency', () => {
    it('should buy currency', async () => {
      const dto: updateCurrencyBalanceDto = {
        user_id: 1,
        amount: 1000,
        usd_balance: null,
        eur_balance: null,
        currencyCode: '840',
      };
      const result = 'Insuficient funds!';
      jest.spyOn(currencyService, 'buyCurrency').mockResolvedValue(result);

      const response = await controller.buyCurrency(dto);

      // Перевіряємо, що результат має певну відповідь
      expect(response).toEqual('Insuficient funds!');
      expect(currencyService.buyCurrency).toHaveBeenCalledWith(dto);
    });
  });
});
