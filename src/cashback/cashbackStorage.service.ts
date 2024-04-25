import { BadRequestException, Injectable } from '@nestjs/common';
import { CardUtils } from '../cards/card.utils';
import { CashBackUtils } from './utils';

@Injectable()
export class CashbackStorage {
  constructor(
    private cashbackUtils: CashBackUtils,
    private cardUtils: CardUtils,
  ) {}

  async isBalanceSufficient(id: number, amount: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    if (balance < 100 || balance <= amount)
      throw new BadRequestException('Ти кого хочеш намахати?');
    return true;
  }

  async getBalance(id: number): Promise<number> {
    const { card_id } = await this.cardUtils.getUserCard(id);
    const currStorage = await this.cashbackUtils.getUserCashBack(card_id);

    return currStorage ? currStorage.cashback_balance : 0;
  }
}
