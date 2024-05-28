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

    this.checkFunds(
      dto.amount,
      currLoanVault.monthly_payment,
      currCard.card_balance,
    );

    await this.loanUtils.executeTransaction('payment', dto);
    return 'Operation Successful!';
  }

  private checkFunds(
    amount: number,
    monthlyPayment: number,
    cardBalance: number,
  ): void {
    if (amount < monthlyPayment || amount > cardBalance) {
      throw new ConflictException('Ховайся! Колєктори вже їдуть!');
    }
  }
}




// Extract Method :
// Виділив логіку перевірки коштів в метод checkFunds.

// Simplify Conditional Expression:
// Умова перевірки коштів спрощена і винесена в окремий метод для підвищення читабельності.
