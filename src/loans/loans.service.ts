import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './loans.model';
import { createLoanDto } from './dto/createLoan.dto';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { LoanUtils } from './utils';
import { PayFullLoanStrategy } from './strategies/payFullStrategy';
import { PayPartialLoanStrategy } from './strategies/payPartStrategy';
import { CreateLoanStrategy } from './strategies/createLoanStrategy';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    private loanUtils: LoanUtils,
    private payPartLoanStrategy: PayPartialLoanStrategy,
    private payFullLoanStrategy: PayFullLoanStrategy,
    private createLoanStrategy: CreateLoanStrategy,
  ) {}
  private YEAR = 12;

  async createLoan(dto: createLoanDto) {
    return await this.createLoanStrategy.execute(dto);
  }

  async payPartLoan(dto: createLoanDto) {
    return await this.payPartLoanStrategy.execute(dto);
  }

  async payFullLoan(dto: createLoanDto) {
    return await this.payFullLoanStrategy.execute(dto);
  }

  // Will update amount every month
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async increaseAmountToPay() {
    const loanVaults = await this.loanUtils.getAllLoans();
    loanVaults.map((loan) => {
      this.updateLoanAmount(loan);
    });
  }

  async showLoanEntities(id: number) {
    return await this.loanModel.findOne({
      where: { borrower_id: id },
    });
  }

  private async updateLoanAmount(loan: Loan): Promise<void> {
    const newAmount =
      loan.amount_to_pay +
      (loan.amount_to_pay * loan.interest_rate) / this.YEAR;
    await loan.update({ amount_to_pay: newAmount });
  }
}



// Extract Method :
// Виділив логіку оновлення суми до сплати в окремий метод updateLoanAmount,

// Replace magic numbers:
// Додав константу YEAR для числа 12