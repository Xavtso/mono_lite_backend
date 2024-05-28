import { BadRequestException, Injectable } from '@nestjs/common';
import { createLoanDto } from '../dto/createLoan.dto';
import { LoanStrategy } from '.';
import { LoanUtils } from '../utils';
import { CardUtils } from '../../cards/card.utils';

@Injectable()
export class PayFullLoanStrategy implements LoanStrategy {
  constructor(private loanUtils: LoanUtils, private cardUtils: CardUtils) {}

  async execute(dto: createLoanDto): Promise<any> {
    const loan = await this.loanUtils.getTargetLoan(dto.id);
    const currCard = await this.cardUtils.getUserCard(dto.borrower_id);

    this.checkFunds(dto.amount, loan.amount_to_pay, currCard.card_balance);

    await loan.destroy();
    return this.loanUtils.executeTransaction('payment', dto);
  }

  private checkFunds(
    amount: number,
    amountToPay: number,
    cardBalance: number,
  ): void {
    if (amount < amountToPay || amount > cardBalance) {
      throw new BadRequestException('Недостатньо коштів на балансі!');
    }
  }
}






// Extract Method :
// Виділив логіку перевірки коштів в метод checkFunds.

// Simplify Conditional Expression:
// Умова перевірки коштів спрощена і винесена в окремий метод для підвищення читабельності.
