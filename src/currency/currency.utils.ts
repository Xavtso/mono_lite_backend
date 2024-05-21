import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Currency } from './currency.model';
import { UserCurrency } from './userCurrency.model';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import axios from 'axios';
import { CardUtils } from '../cards/card.utils';

@Injectable()
export class CurrencyUtils {
  constructor(
    @InjectModel(Currency) private currencyModel: typeof Currency,
    @InjectModel(UserCurrency) private userCurrencyModel: typeof UserCurrency,
    private cardUtils: CardUtils,
  ) {}
  async getUserEntity(id: number) {
    const [currEntity, created] = await this.userCurrencyModel.findOrCreate({
      where: { user_id: id },
    });

    return currEntity;
  }

  async getCurrencyInfo() {
    let currencyData = [];

    await axios
      .get('https://api.monobank.ua/bank/currency')
      .then((response) => (currencyData = response.data.splice(0, 2)))
      .catch((error) => console.log(error));

    await this.updateCurrenciesInfo(currencyData[0]);
    await this.updateCurrenciesInfo(currencyData[1]);

    return currencyData;
  }

  async updateCurrenciesInfo(currencyData: any) {
    const [currency, created] = await this.currencyModel.findOrCreate({
      where: { currency_id: currencyData.currencyCodeA },
    });

    const updatedCurrency = await currency.update({
      date: currencyData.date,
      rateBuy: currencyData.rateBuy,
      rateSell: currencyData.rateSell,
    });

    return updatedCurrency;
  }
  async getUserCard(id: number) {
    const currCard = this.cardUtils.getUserCard(id);
    return currCard;
  }
  async getOperationInfo(dto: updateCurrencyBalanceDto) {
    const userEntity = await this.getUserEntity(+dto.user_id);
    const currCard = await this.getUserCard(+dto.user_id);
    const currency = await this.currencyModel.findOne({
      where: { currency_id: dto.currencyCode },
    });
    return { userEntity, currCard, currency };
  }
}
