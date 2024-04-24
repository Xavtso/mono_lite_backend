import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './loans.model';
import { createLoanDto } from './dto/createLoan.dto';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { LoanUtils } from './utils';
import { PayFulllLoanStrategy } from './strategies/payFullStrategy';
import { PayPartialLoanStrategy } from './strategies/payPartStrategy';
import { CreateLoanStrategy } from './strategies/createLoanStrategy';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    private loanUtils: LoanUtils,
    private payPartLoanStrategy: PayPartialLoanStrategy,
    private payFullLoanStrategy: PayFulllLoanStrategy,
    private createLoanStrategy: CreateLoanStrategy,
  ) {}

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
      const newAmount =
        loan.amount_to_pay + (loan.amount_to_pay * loan.interest_rate) / 12;
      loan.update({ amount_to_pay: newAmount });
    });
  }

  async showLoanEntities(id: number) {
    const loan = await this.loanModel.findAll({
      where: { borrower_id: id },
    });
    return loan;
  }
}
