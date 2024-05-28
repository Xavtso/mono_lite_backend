import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Currency } from './currency.model';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { CurrencyUtils } from './currency.utils';
import { CurrencyState } from './currencyStates';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BuyState } from './buyState';
import { SellState } from './sellState';

@Injectable()
export class CurrencyService {
  private currentState: CurrencyState;
  constructor(
    @InjectModel(Currency) private currencyModel: typeof Currency,
    private utils: CurrencyUtils,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async getCurrencyInfo() {
    return this.utils.getCurrencyInfo();
  }

  async sendCurrencyInfo() {
    const currencies = await this.currencyModel.findAll();
    return currencies;
  }

  setBuyState() {
    this.currentState = new BuyState(this.utils);
  }

  setSellState() {
    this.currentState = new SellState(this.utils);
  }

  async buyCurrency(dto: updateCurrencyBalanceDto) {
    this.setBuyState();
    return this.currentState.buy(dto);
  }

  async sellCurrency(dto: updateCurrencyBalanceDto) {
    this.setSellState();
    return this.currentState.sell(dto);
  }
}
