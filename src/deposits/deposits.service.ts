import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Deposit } from './deposit.model';
import { Card } from '../cards/card.model';
import { Transaction } from '../transactions/transactions.model';
import { createDepositDto } from './dto/createDeposit.dto';
import { Cron, CronExpression } from '@nestjs/schedule/dist';

@Injectable()
export class DepositsService {
  constructor(
    @InjectModel(Deposit) private depositModel: typeof Deposit,
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async createDeposit(dto: createDepositDto) {
    const currCard = await this.cardModel.findOne({
      where: { user_id: dto.user_id },
    });

    const isEnough = currCard.card_balance >= dto.amount;
    if (isEnough) {
      const depositVault = await this.depositModel.create(dto);
      await this.calcMonthlyPayment(depositVault);
      await this.calcEndDate(depositVault);
      this.makeTransaction('deposit', dto.user_id, dto.amount);

      return depositVault;
    } else
      throw new BadRequestException(
        'А ти конкретний інвестор🤔 - Недостатньо коштів!',
      );
  }

  async makeTransaction(operation: string, id: number, amount: number) {
    const currCard = await this.cardModel.findByPk(id);
    const fullName = currCard.owner_name + ' ' + currCard.owner_surname;
    const description =
      operation === 'deposit' ? 'Bank deposit💵' : 'Dividends🎉';
    const receiverCard =
      operation === 'deposit' ? 'Mono-Card' : currCard.card_number;

    if (operation === 'deposit') {
      await currCard.update({ card_balance: currCard.card_balance - amount });
      const createdTransaction = await this.transactionModel.create({
        sender_card_id: currCard.card_id,
        sender_full_name: fullName,
        receiver_card_id: Math.random(),
        receiver_card_number: receiverCard,
        receiver_full_name: 'Deposit',
        transaction_amount: amount,
        transaction_description: description,
        transaction_type: 'deposit',
      });
      return createdTransaction;
    }
    if (operation === 'dividends') {
      await currCard.update({ card_balance: currCard.card_balance + amount });
      const createdTransaction = await this.transactionModel.create({
        sender_card_id: Math.random(),
        sender_full_name: 'Dividents',
        receiver_card_id: Math.random(),
        receiver_card_number: receiverCard,
        receiver_full_name: fullName,
        transaction_amount: amount,
        transaction_description: description,
        transaction_type: 'deposit',
      });
      return createdTransaction;
    }
  }

  async updateAmountOfDeposit(dto: createDepositDto) {
    const currVault = await this.depositModel.findOne({
      where: { user_id: dto.user_id },
    });
    const currCard = await this.cardModel.findOne({
      where: { user_id: dto.user_id },
    });

    const isEnough = currCard.card_balance >= dto.amount;
    if (isEnough) {
      const updatedVault = await currVault.update({
        amount: currVault.amount + dto.amount,
      });
      await this.makeTransaction('deposit', dto.user_id, dto.amount);
      await this.calcMonthlyPayment(updatedVault);
      return updatedVault;
    } else
      throw new BadRequestException(
        'А ти конкретний інвестор🤔 - Недостатньо коштів!',
      );
  }
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async payPercentage() {
    const vaults = await this.depositModel.findAll();

    const dividends = vaults.map((vault) =>
      vault.end_date < new Date()
        ? this.makeTransaction(
            'dividends',
            vault.user_id,
            vault.monthly_payment,
          )
        : vault.destroy(),
    );
    return dividends;
  }

  async calcMonthlyPayment(vault: Deposit) {
    const totalAmount = vault.amount;
    // Calculate monthly interest rate
    const monthlyInterestRate = vault.interest_rate / 12;

    // Calculate monthly payment using formula
    const monthlyPayment = totalAmount * monthlyInterestRate;

    // Update deposit with new monthly payment value
    const updatedVault = await vault.update({
      monthly_payment: monthlyPayment,
    });

    return updatedVault;
  }

  async showUserVaults(id: number) {
    const vaults = await this.depositModel.findAll({ where: { user_id: id } });
    return vaults;
  }
  async showAllVaults() {
    const vaults = await this.depositModel.findAll();
    return vaults;
  }

  async calcEndDate(vault: Deposit) {
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + vault.term));
    const updatedVault = await vault.update({ end_date: futureDate });
    return updatedVault;
  }

  async destroyVault(dto: createDepositDto) {
    const vault = await this.depositModel.findByPk(dto.id);
    try {
      await this.makeTransaction('dividends', vault.user_id, vault.amount);
      await vault.destroy();
    } catch (error) {
      console.log(error);
    }
  }
}
