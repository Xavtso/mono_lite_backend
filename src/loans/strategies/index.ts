import { createLoanDto } from '../dto/createLoan.dto';

export interface LoanStrategy {
  execute(dto: createLoanDto): Promise<string>;
}
