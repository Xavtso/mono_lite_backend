import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CashBack } from './cashback.model';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CardsService } from 'src/cards/cards.service';
import { CardUtils } from 'src/cards/card.utils';

@Injectable()
export class CashbackStorage {
  constructor(
    @InjectModel(CashBack) private cashbackModel: typeof CashBack,
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
    const [currStorage, created] = await this.cashbackModel.findOrCreate({
      where: { card_id: card_id },
      defaults: { cashback_balance: 0 },
    });
    return currStorage ? currStorage.cashback_balance : 0;
  }
}
