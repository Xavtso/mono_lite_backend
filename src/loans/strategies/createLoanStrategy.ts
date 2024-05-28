import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    await this.checkIfLoanExists(dto.borrower_id);
    const loan = await this.createLoan(dto);
    await this.updateLoanDetails(loan, dto);
    return 'Loan Created';
  }

  private async checkIfLoanExists(borrowerId: number): Promise<void> {
    const isAlreadyExist = await this.loanUtils.checkIfExist(borrowerId);
    if (isAlreadyExist) {
      throw new ConflictException('You can have only one loan!');
    }
  }

  private async createLoan(dto: createLoanDto): Promise<Loan> {
    try {
      return await this.loanModel.create(dto);
    } catch (error) {
      throw new InternalServerErrorException('Error creating loan');
    }
  }

  private async updateLoanDetails(
    loan: Loan,
    dto: createLoanDto,
  ): Promise<void> {
    try {
      await this.loanUtils.updateMonthlyPayment(loan, dto);
      await this.loanUtils.executeTransaction('receive', dto);
    } catch (error) {
      throw new InternalServerErrorException('Error updating loan details');
    }
  }
}





// Extract Method:

// Виділив логіку перевірки існуючої позики в метод checkIfLoanExists.
// Виділив логіку створення позики в метод createLoan.
// Виділив логіку оновлення деталей позики в метод updateLoanDetails.

// Improve Exception Handling:
// Введено більш конкретні виключення ConflictException і InternalServerErrorException з відповідними повідомленнями.

// Optimize Flow:
// Логіка перевірки існуючої позики виконується до створення нової позики, що робить процес більш ефективним.