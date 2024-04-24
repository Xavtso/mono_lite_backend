import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { createLoanDto } from '../dto/createLoan.dto';
import { LoanStrategy } from '.';
import { LoanUtils } from '../utils';
import { CardUtils } from 'src/cards/card.utils';

@Injectable()
export class PayFulllLoanStrategy implements LoanStrategy {
  constructor(private loanUtils: LoanUtils, private cardUtils: CardUtils) {}

  async execute(dto: createLoanDto): Promise<any> {
    const loan = await this.loanUtils.getTargetLoan(dto.id);
    const currCard = await this.cardUtils.getUserCard(dto.borrower_id);
    const isEnough =
      dto.amount >= loan.amount_to_pay && dto.amount <= currCard.card_balance;

    if (!isEnough)
      throw new BadRequestException('Недостатньо коштів на балансі!');

    await loan.destroy();
    return this.loanUtils.executeTransaction('payment', dto);
  }
}
