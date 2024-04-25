import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from '../loans.model';
import { createLoanDto } from '../dto/createLoan.dto';
import { CardUtils } from '../../cards/card.utils';
import { TransactionRepository } from '../../transactions/transactionRepository';

@Injectable()
export class LoanUtils {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}

  async getTargetLoan(id: number) {
    return await this.loanModel.findByPk(id);
  }

  async withdrawLoanBalance(loan: Loan, amount: number) {
    return await loan.update({ amount_to_pay: loan.amount_to_pay - amount });
  }

  async calculateMonthlyPayment(
    amount: number,
    interestRate: number,
    term: number,
  ): Promise<number> {
    const monthlyInterestRate = interestRate / 12 / 100;
    const denominator = Math.pow(1 + monthlyInterestRate, -term);
    const payment = (amount * monthlyInterestRate) / (1 - denominator);
    return Math.ceil(payment);
  }
  async calcEndDate(loan: Loan) {
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + loan.term));
    const updatedVault = await loan.update({ end_date: futureDate });
    return updatedVault;
  }

  async updateMonthlyPayment(loan: Loan, dto: createLoanDto) {
    const monthlyPayment = await this.calculateMonthlyPayment(
      dto.amount,
      dto.interest_rate,
      dto.term,
    );
    await loan.update({ amount_to_pay: dto.amount });
    await loan.update({ monthly_payment: monthlyPayment });
    await this.calcEndDate(loan);
    return 'Monthly Payment updated';
  }

  async getAllLoans() {
    return await this.loanModel.findAll();
  }

  async executeTransaction(operation: string, dto: createLoanDto) {
    const loan = await this.getTargetLoan(dto.id);
    const currCard = await this.cardUtils.getUserCard(dto.borrower_id);
    const full_name = `${currCard.owner_name} ${currCard.owner_surname}`;
    const descriptionTxt =
      operation === 'receive' ? 'Отримання кредитування' : 'Сплата кредиту';

    await this.transactionRepository.createTransactionRecord({
      sender_card_id: Math.round(Math.random()),
      sender_full_name: 'Mono-Loan',
      receiver_card_id: currCard.card_id,
      receiver_card_number: currCard.card_number,
      receiver_full_name: full_name,
      transaction_amount: dto.amount,
      transaction_description: `${descriptionTxt}`,
      transaction_type: 'LOAN',
    });

    if (operation === 'receive') {
      await this.cardUtils.addBalanceToCard(currCard, dto.amount);
    }

    if (operation === 'payment') {
      await this.cardUtils.withdrawBalanceFromCard(currCard, dto.amount);
      await this.withdrawLoanBalance(loan, dto.amount);
      this.checkIsRepaid(loan);
    }

    return 'Transaction successful';
  }
  async checkIsRepaid(loan: Loan) {
    const IsRepaid = loan.amount_to_pay <= 0;
    if (IsRepaid) {
      loan.destroy();
      return 'Congratulations you are free for now!🎉';
    } else return;
  }
}
