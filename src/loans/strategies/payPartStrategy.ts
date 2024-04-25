import { ConflictException, Injectable } from '@nestjs/common';
import { createLoanDto } from '../dto/createLoan.dto';
import { LoanStrategy } from '.';
import { LoanUtils } from '../utils';
import { CardUtils } from '../../cards/card.utils';

@Injectable()
export class PayPartialLoanStrategy implements LoanStrategy {
  constructor(private loanUtils: LoanUtils, private cardUtils: CardUtils) {}

  async execute(dto: createLoanDto): Promise<any> {
    const currLoanVault = await this.loanUtils.getTargetLoan(dto.id);
    const currCard = await this.cardUtils.getUserCard(dto.borrower_id);

    const isEnough =
      dto.amount >= currLoanVault.monthly_payment &&
      dto.amount <= currCard.card_balance;

    if (!isEnough) throw new ConflictException('Ховайся! Колєктори вже їдуть!');

    await this.loanUtils.executeTransaction('payment', dto);
    return 'Operation Successful!';
  }
}
