import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Deposit } from '../deposit.model';
import { CardUtils } from '../../cards/card.utils';
import { TransactionRepository } from '../../transactions/transactionRepository';

@Injectable()
export class DepositUtils {
  private YEAR = 12;

  constructor(
    @InjectModel(Deposit) private depositModel: typeof Deposit,
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}

  async calcEndDate(vault: Deposit) {
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + vault.term));
    const updatedVault = await vault.update({ end_date: futureDate });
    return updatedVault;
  }
  async calcMonthlyPayment(vault: Deposit) {
    const totalAmount = vault.amount;
    const monthlyInterestRate = vault.interest_rate / this.YEAR;
    const monthlyPayment = totalAmount * monthlyInterestRate;

    return await this.updateMonthlyPayment(vault, monthlyPayment);
  }

  async updateMonthlyPayment(vault: Deposit, amount: number) {
    const updatedVault = await vault.update({
      monthly_payment: amount,
    });

    return updatedVault;
  }

  async addBalanceToVault(vault: Deposit, amount: number) {
    return await vault.update({
      amount: vault.amount + amount,
    });
  }
  async withdrawBalanceFromVault(vault: Deposit, amount: number) {
    return await vault.update({
      amount: vault.amount - amount,
    });
  }

  async getTargetVault(user_id: number) {
    return await this.depositModel.findOne({
      where: { user_id },
    });
  }
  async getAllVaults() {
    return await this.depositModel.findAll();
  }

  async makeTransaction(operation: string, id: number, amount: number) {
    const currCard = await this.cardUtils.getUserCard(id);
    const fullName = `${currCard.owner_name} ${currCard.owner_surname}`;
    const description =
      operation === 'deposit' ? 'Bank deposit💵' : 'Dividends🎉';
    const receiverCard =
      operation === 'deposit' ? 'Mono-Card' : currCard.card_number;

    if (operation === 'deposit') {
      await this.cardUtils.withdrawBalanceFromCard(currCard, amount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: currCard.card_id,
        sender_full_name: fullName,
        receiver_card_id: Math.round(Math.random()),
        receiver_card_number: receiverCard,
        receiver_full_name: 'Deposit',
        transaction_amount: amount,
        transaction_description: description,
        transaction_type: 'deposit',
      });
      return 'Transaction Successful';
    }
    if (operation === 'dividends') {
      await this.cardUtils.addBalanceToCard(currCard, amount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: Math.round(Math.random()),
        sender_full_name: 'Dividents',
        receiver_card_id: currCard.card_id,
        receiver_card_number: receiverCard,
        receiver_full_name: fullName,
        transaction_amount: amount,
        transaction_description: description,
        transaction_type: 'deposit',
      });
      return 'Transaction Successful';
    }
  }
}
