import { BadRequestException } from '@nestjs/common';
import { CurrencyUtils } from './currency.utils';
import { CurrencyState } from './currencyStates';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { UserCurrency } from './userCurrency.model';
import { Card } from '../cards/card.model';

// Concrete state for selling currency
export class SellState implements CurrencyState {
  private readonly USD_CURRENCY_ID = 840;
  private readonly EUR_CURRENCY_ID = 978;

  constructor(private utils: CurrencyUtils) {}

  async buy(dto: updateCurrencyBalanceDto) {
    throw new BadRequestException(
      'Cannot buy currency in the state of selling',
    );
  }

  async sell(dto: updateCurrencyBalanceDto) {
    const { userEntity, currCard, currency } =
      await this.utils.getOperationInfo(dto);
    const amountInUAH = this.calculateAmountInUAH(dto.amount, currency.rateBuy);
    const errorJoke = this.getErrorJoke(currency.currency_id);

    try {
      await this.updateBalances(
        currency.currency_id,
        userEntity,
        currCard,
        dto.amount,
        amountInUAH,
      );
      return 'Currency successfully sold!';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Insufficient currency balance. Call your grandma in ${errorJoke}`,
      );
    }
  }

  private calculateAmountInUAH(amount: number, rateBuy: number): number {
    return amount * rateBuy;
  }

  private getErrorJoke(currencyId: number): string {
    return currencyId === this.USD_CURRENCY_ID ? 'America💵' : 'Italy💶';
  }

  private async updateBalances(
    currencyId: number,
    userEntity: UserCurrency,
    currCard: Card,
    amount: number,
    amountInUAH: number,
  ) {
    if (currencyId === this.USD_CURRENCY_ID) {
      this.checkBalance(userEntity.usd_balance, amount, 'USD');
      await userEntity.update({ usd_balance: userEntity.usd_balance - amount });
    } else if (currencyId === this.EUR_CURRENCY_ID) {
      this.checkBalance(userEntity.eur_balance, amount, 'EUR');
      await userEntity.update({ eur_balance: userEntity.eur_balance - amount });
    } else {
      throw new BadRequestException('Unsupported currency');
    }
    await currCard.update({
      card_balance: currCard.card_balance + amountInUAH,
    });
  }

  private checkBalance(
    balance: number,
    amount: number,
    currency: string,
  ): void {
    if (balance < amount) {
      throw new BadRequestException(`Insufficient ${currency} balance`);
    }
  }
}

//1 Extract Method:
// Виділив логіку обчислення суми в метод calculateAmountInUAH.
// Виділив логіку отримання жарту помилки в метод getErrorJoke.
// Виділив логіку оновлення балансів в метод updateBalances.
// Виділив логіку перевірки балансу в метод checkBalance.

//2 Replace Magic Number with Symbolic Constant:
// Додав константи USD_CURRENCY_ID та EUR_CURRENCY_ID.

//3 Simplify Conditional Expression 

// Спрощена логіка перевірки та оновлення балансу для USD та EUR.