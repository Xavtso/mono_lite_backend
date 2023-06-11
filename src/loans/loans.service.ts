import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './loans.model';
import { createLoanDto } from './dto/createLoan.dto';
import { Transaction } from '../transactions/transactions.model';
import { Card } from '../cards/card.model';
import { Cron, CronExpression } from '@nestjs/schedule/dist';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async createLoan(dto: createLoanDto): Promise<Loan> {
    const loan = await this.loanModel.create(dto);
    const monthlyPayment = this.calculateMonthlyPayment(
      dto.amount,
      dto.interest_rate,
      dto.term,
    );
    await loan.update({ amount_to_pay: dto.amount });
    await loan.update({ monthly_payment: monthlyPayment });
    await this.calcEndDate(loan);
    await this.prepareTransaction('receive', dto);
    return loan;
  }

  private calculateMonthlyPayment(
    amount: number,
    interestRate: number,
    term: number,
  ): number {
    const monthlyInterestRate = interestRate / 12 / 100;
    const denominator = Math.pow(1 + monthlyInterestRate, -term);
    const payment = (amount * monthlyInterestRate) / (1 - denominator);
    return Math.ceil(payment);
  }

  // Will update amount every month
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async increaseAmountToPay() {
    const loanVaults = await this.loanModel.findAll();
    loanVaults.map((loan) => {
      const newAmount =
        loan.amount_to_pay + (loan.amount_to_pay * loan.interest_rate) / 12;
      loan.update({ amount_to_pay: newAmount });
    });
  }

  async prepareTransaction(operation: string, dto: createLoanDto) {
    const currVault = await this.loanModel.findByPk(dto.id);
    const currCard = await this.cardModel.findByPk(dto.borrower_id);
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;
    const descriptionTxt =
      operation === 'receive'
        ? 'Отримання кредитування'
        : 'Сплата частини кредиту';

    const createdTransaction = await this.transactionModel.create({
      sender_card_id: Math.random(),
      sender_full_name: 'Mono-Loan',
      receiver_card_id: currCard.card_id,
      receiver_card_number: currCard.card_number,
      receiver_full_name: full_name,
      transaction_amount: dto.amount,
      transaction_description: `${descriptionTxt}`,
      transaction_type: 'LOAN',
    });

    if (operation === 'receive') {
      await this.cardModel.update(
        { card_balance: currCard.card_balance + dto.amount },
        { where: { card_id: currCard.card_id } },
      );
    }

    if (operation === 'payment') {
      await this.cardModel.update(
        { card_balance: currCard.card_balance - dto.amount },
        { where: { card_id: currCard.card_id } },
      );
      await this.loanModel.update(
        { amount_to_pay: currCard.card_balance - dto.amount },
        { where: { id: currVault.id } },
      );
      this.checkIsRepaid(currVault);
    }

    return createdTransaction;
  }

  async payPartOfLoan(dto: createLoanDto) {
    const currLoanVault = await this.loanModel.findOne({
      where: { id: dto.id },
    });

    const currCard = await this.cardModel.findByPk(dto.borrower_id);

    const isEnough =
      dto.amount >= currLoanVault.monthly_payment &&
      dto.amount <= currCard.card_balance;

    if (isEnough) {
      return this.prepareTransaction('payment', dto);
    } else throw new ConflictException('Ховайся! Колєктори вже їдуть!');
  }

  async payFullLoan(dto: createLoanDto) {
    const currLoanVault = await this.loanModel.findOne({
      where: { id: dto.id },
    });

    const currCard = await this.cardModel.findByPk(dto.borrower_id);

    const isEnough =
      dto.amount >= currLoanVault.amount_to_pay &&
      dto.amount <= currCard.card_balance;

    if (isEnough) {
      await currLoanVault.destroy();
      return this.prepareTransaction('payment', dto);
    }
  }

  async showLoanEntity(id: number) {
    const loan = await this.loanModel.findAll({
      where: { borrower_id: id },
    });
    return loan;
  }

  async calcEndDate(vault: Loan) {
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + vault.term));
    const updatedVault = await vault.update({ end_date: futureDate });
    return updatedVault;
  }

  async checkIsRepaid(vault: Loan) {
    const IsRepaid = vault.amount_to_pay <= 0;
    if (IsRepaid) {
      vault.destroy();
      return 'Congratulations you are free for now!🎉';
    } else return;
  }
}
