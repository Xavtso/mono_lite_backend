import { BadRequestException } from '@nestjs/common';
import { CurrencyUtils } from './currency.utils';
import { CurrencyState } from './currencyStates';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { Card } from '../cards/card.model';
import { UserCurrency } from './userCurrency.model';

// Concrete state for buying currency
export class BuyState implements CurrencyState {
  constructor(private utils: CurrencyUtils) {}

  async buy(dto: updateCurrencyBalanceDto) {
    const { userEntity, currCard, currency } =
      await this.utils.getOperationInfo(dto);
    const amountInUAH = this.calculateAmountInUAH(
      dto.amount,
      currency.rateSell,
    );

    this.checkSufficientFunds(currCard.card_balance, amountInUAH);

    try {
      await this.updateBalances(userEntity, currCard, dto.amount, amountInUAH);
      return 'Currency successfully bought!';
    } catch (error) {
      this.handleError(error);
    }
  }

  private calculateAmountInUAH(amount: number, rateSell: number): number {
    return amount * rateSell;
  }

  private checkSufficientFunds(cardBalance: number, amountInUAH: number): void {
    if (cardBalance < amountInUAH) {
      throw new BadRequestException('Insufficient funds');
    }
  }

  private async updateBalances(
    userEntity: UserCurrency,
    currCard: Card,
    amount: number,
    amountInUAH: number,
  ): Promise<void> {
    await userEntity.update({
      usd_balance: userEntity.usd_balance + amount,
    });
    await currCard.update({
      card_balance: currCard.card_balance - amountInUAH,
    });
  }

  private handleError(error: any): void {
    console.log(error);
    throw new BadRequestException('An error occurred during the transaction');
  }

  sell(dto: updateCurrencyBalanceDto) {
    throw new BadRequestException(
      'Cannot sell currency in the state of buying',
    );
  }
}

// Extract Method:

// Виділив логіку обчислення суми в метод calculateAmountInUAH.
// Виділив логіку перевірки достатнього балансу в метод checkSufficientFunds.
// Виділив логіку оновлення балансів у метод updateBalances.
// Виділив логіку обробки помилок в метод handleError.
