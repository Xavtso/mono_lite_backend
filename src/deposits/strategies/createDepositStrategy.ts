import { BadRequestException, Injectable } from '@nestjs/common';
import { createDepositDto } from '../dto/createDeposit.dto';
import { DepositStrategy } from '.';
import { CardUtils } from '../../cards/card.utils';
import { DepositUtils } from '../utils';
import { InjectModel } from '@nestjs/sequelize';
import { Deposit } from '../deposit.model';

@Injectable()
export class CreateDepositStrategy implements DepositStrategy {
  constructor(
    @InjectModel(Deposit) private depositModel: typeof Deposit,
    private cardUtils: CardUtils,
    private depositUtils: DepositUtils,
  ) {}
  async execute(dto: createDepositDto): Promise<string> {
    const currCard = await this.cardUtils.getUserCard(dto.user_id);
    const isEnough = currCard.card_balance >= dto.amount;

    if (isEnough) {
      throw new BadRequestException(
        'А ти конкретний інвестор🤔 - Недостатньо коштів!',
      );
    }
    try {
      const depositVault = await this.depositModel.create(dto);
      await this.depositUtils.calcMonthlyPayment(depositVault);
      await this.depositUtils.calcEndDate(depositVault);
      this.depositUtils.makeTransaction('deposit', dto.user_id, dto.amount);

      return 'Deposit Created!';
    } catch (error) {
      throw new Error('Some error occured!');
    }
  }
}
