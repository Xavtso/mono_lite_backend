import { Injectable } from '@nestjs/common';
import { createLoanDto } from '../dto/createLoan.dto';
import { Loan } from '../loans.model';

import { InjectModel } from '@nestjs/sequelize';
import { LoanStrategy } from '.';
import { LoanUtils } from '../utils';

@Injectable()
export class CreateLoanStrategy implements LoanStrategy {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    private loanUtils: LoanUtils,
  ) {}

  async execute(dto: createLoanDto): Promise<string> {
    try {
      const loan = await this.loanModel.create(dto);
      await this.loanUtils.updateMonthlyPayment(loan, dto);
      await this.loanUtils.executeTransaction('receive', dto);
      return 'Loan Created';
    } catch (error) {
      throw new Error('Some error occured!');
    }
  }
}
