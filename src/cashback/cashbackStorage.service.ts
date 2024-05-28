import { BadRequestException, Injectable } from '@nestjs/common';
import { CardUtils } from '../cards/card.utils';
import { CashBackUtils } from './utils';

@Injectable()
export class CashbackStorage {
  private readonly MIN_BALANCE = 100;

  constructor(
    private cashbackUtils: CashBackUtils,
    private cardUtils: CardUtils,
  ) {}

  async isBalanceSufficient(id: number, amount: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    this.checkSufficientBalance(balance, amount);
    return true;
  }

  private async getBalance(id: number): Promise<number> {
    const { card_id } = await this.cardUtils.getUserCard(id);
    const currStorage = await this.cashbackUtils.getUserCashBack(card_id);

    return currStorage ? currStorage.cashback_balance : 0;
  }

  private checkSufficientBalance(balance: number, amount: number): void {
    if (balance < this.MIN_BALANCE || balance <= amount) {
      throw new BadRequestException('Ти кого хочеш намахати?');
    }
  }
}

// Extract Method:

// Вихідний код:
// метод isBalanceSufficient містив логіку перевірки балансу.

// Покращений код:
// логіка перевірки балансу винесена в окремий метод checkSufficientBalance.

// Це поліпшує читабельність методу isBalanceSufficient та дозволяє легко змінювати умови перевірки балансу у майбутньому.

// Replace Magic Number with Symbolic Constant :

// Вихідний код: значення 100 було використано без пояснення.
// Покращений код: додана константа MIN_BALANCE, що замінює магічне число.

// Це робить код зрозумілішим і полегшує зміну значення мінімального балансу у майбутньому.

// Error Handling Improvement :

// Обробка помилки при недостатньому балансі винесена в окремий метод checkSufficientBalance.
