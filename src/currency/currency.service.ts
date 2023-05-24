import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Currency } from './currency.model';
import { currencyDto } from './dto/currency.dto';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { UserCurrency } from './userCurrency.model';
import { Card } from '../cards/card.model';
import { Transaction } from '../transactions/transactions.model';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency) private currencyModel: typeof Currency,
    @InjectModel(UserCurrency) private userCurrencyModel: typeof UserCurrency,
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async updateCurrency(dto: currencyDto) {
    const currency = await this.currencyModel.findByPk(dto.currency_id);
    const updatedCurrency = await currency.update({
      date: dto.date,
      rateBuy: dto.rateBuy,
      rateSell: dto.rateSell,
    });

    return updatedCurrency;
  }

  async sendCurrencyInfo() {
    const currencies = await this.currencyModel.findAll();
    return currencies;
  }

  async getUserCurrencyEntity(id: number) {
    const [currEntity, created] = await this.userCurrencyModel.findOrCreate({
      where: { user_id: id },
    });

    return currEntity;
  }

  async buyCurrency(dto: updateCurrencyBalanceDto) {
    const userCurrency = await this.getUserCurrencyEntity(dto.user_id);
    const currCard = await this.cardModel.findByPk(dto.user_id);
    const currency = await this.currencyModel.findOne({
      where: { currency_id: dto.currencyCode },
    });
    const amountInUAH = dto.amount * currency.rateSell;
    const isEnough = currCard.card_balance >= amountInUAH;

    if (isEnough) {
      try {
        //   Buy USD Currency
        if (currency.currency_id === 840) {
          const updatedUserCurrency = await userCurrency.update({
            usd_balance: userCurrency.usd_balance + dto.amount,
          });
          await currCard.update({
            card_balance: currCard.card_balance - amountInUAH,
          });

          return updatedUserCurrency;
        }

        //  Buy EUR Currency
        if (currency.currency_id === 978) {
          const updatedUserCurrency = await userCurrency.update({
            eur_balance: userCurrency.eur_balance + dto.amount,
          });
          await currCard.update({
            card_balance: currCard.card_balance - amountInUAH,
          });

          return updatedUserCurrency;
        }
      } catch (error) {
        console.log(error);
      }
    } else throw new BadRequestException('Йой.. Бракує грошей😥');
  }
  async sellCurrency(dto: updateCurrencyBalanceDto) {
    const userCurrency = await this.getUserCurrencyEntity(dto.user_id);
    const currCard = await this.cardModel.findByPk(dto.user_id);
    const currency = await this.currencyModel.findOne({
      where: { currency_id: dto.currencyCode },
    });
    console.log(currency);
    const amountInUAH = dto.amount * currency.rateBuy;
    const errorJoke = currency.currency_id === 840 ? 'Америку💵' : 'Італію💶';
    try {
      //   Sell USD Currency
      if (
        currency.currency_id === 840 &&
        userCurrency.usd_balance >= dto.amount
      ) {
        const updatedUserCurrency = await userCurrency.update({
          usd_balance: userCurrency.usd_balance - dto.amount,
        });
        await currCard.update({
          card_balance: currCard.card_balance + amountInUAH,
        });

        return updatedUserCurrency;
      }

      //  Sell EUR Currency
      if (
        currency.currency_id === 978 &&
        userCurrency.eur_balance >= dto.amount
      ) {
        const updatedUserCurrency = await userCurrency.update({
          eur_balance: userCurrency.eur_balance - dto.amount,
        });
        await currCard.update({
          card_balance: currCard.card_balance + amountInUAH,
        });

        return updatedUserCurrency;
      }
    } catch (error) {
      console.log(error);
    }
    throw new BadRequestException(
      `Недостатньо валюти😥 Тре дзонити бабі в ${errorJoke}`,
    );
  }
}
