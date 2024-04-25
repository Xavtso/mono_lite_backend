import { BadRequestException, Injectable } from '@nestjs/common';
import { createDepositDto } from '../dto/createDeposit.dto';
import { DepositStrategy } from '.';
import { CardUtils } from '../../cards/card.utils';
import { DepositUtils } from '../utils';

@Injectable()
export class UpdateDepositStrategy implements DepositStrategy {
  constructor(
    private cardUtils: CardUtils,
    private depositUtils: DepositUtils,
  ) {}
  async execute({ user_id, amount }: createDepositDto): Promise<string> {
    const currVault = await this.depositUtils.getTargetVault(user_id);
    const currCard = await this.cardUtils.getUserCard(user_id);

    const isEnough = currCard.card_balance >= amount;
    if (isEnough) {
      throw new BadRequestException(
        'А ти конкретний інвестор🤔 - Недостатньо коштів!',
      );
    }
    try {
      const updatedVault = await this.depositUtils.addBalanceToVault(
        currVault,
        amount,
      );
      await this.depositUtils.makeTransaction('deposit', user_id, amount);
      await this.depositUtils.calcMonthlyPayment(updatedVault);
      return 'Deposit Amount Updated';
    } catch (error) {
      throw new Error('Some error occured');
    }
  }
}
