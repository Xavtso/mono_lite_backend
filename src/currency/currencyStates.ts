import { BadRequestException } from '@nestjs/common';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { CurrencyUtils } from './currency.utils';

// Interface for state
export interface CurrencyState {
  buy(dto: updateCurrencyBalanceDto): any;
  sell(dto: updateCurrencyBalanceDto): any;
}

// Concrete state for buying currency
export class BuyState implements CurrencyState {
  constructor(private utils: CurrencyUtils) {}

  async buy(dto: updateCurrencyBalanceDto) {
    const { userEntity, currCard, currency } =
      await this.utils.getOperationInfo(dto);
    const amountInUAH = dto.amount * currency.rateSell;
    const isEnough = currCard.card_balance >= amountInUAH;
    console.log(isEnough, currCard.card_balance,amountInUAH);

    if (isEnough) {
      try {
        const updatedUserCurrency = await userEntity.update({
          usd_balance: userEntity.usd_balance + dto.amount,
        });
        await currCard.update({
          card_balance: currCard.card_balance - amountInUAH,
        });

        return updatedUserCurrency;
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new BadRequestException('Insufficient funds');
    }
  }

  sell(dto: updateCurrencyBalanceDto) {
    throw new BadRequestException(
      'Cannot sell currency in the state of buying',
    );
  }
}

// Concrete state for selling currency
export class SellState implements CurrencyState {
  constructor(private utils: CurrencyUtils) {}

  async buy(dto: updateCurrencyBalanceDto) {
    throw new BadRequestException(
      'Cannot buy currency in the state of selling',
    );
  }

  async sell(dto: updateCurrencyBalanceDto) {
    const { userEntity, currCard, currency } =
      await this.utils.getOperationInfo(dto);
    const amountInUAH = dto.amount * currency.rateBuy;
    const errorJoke = currency.currency_id === 840 ? 'America💵' : 'Italy💶';

    try {
      if (
        currency.currency_id === 840 &&
        userEntity.usd_balance >= dto.amount
      ) {
        const updatedUserCurrency = await userEntity.update({
          usd_balance: userEntity.usd_balance - dto.amount,
        });
        await currCard.update({
          card_balance: currCard.card_balance + amountInUAH,
        });

        return updatedUserCurrency;
      }

      if (
        currency.currency_id === 978 &&
        userEntity.eur_balance >= dto.amount
      ) {
        const updatedUserCurrency = await userEntity.update({
          eur_balance: userEntity.eur_balance - dto.amount,
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
      `Insufficient currency balance. Call your grandma in ${errorJoke}`,
    );
  }
}
