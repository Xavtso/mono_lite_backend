import { Injectable, BadRequestException } from '@nestjs/common';
import { createTransactionDto } from './dto/create-transaction.dto';
import { TransferStrategy, DepositStrategy, ExpenseStrategy } from './Strategy';
import { Transaction } from './transactions.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
    private transferStrategy: TransferStrategy,
    private depositStrategy: DepositStrategy,
    private expenseStrategy: ExpenseStrategy,
  ) {}

  async whichTypeOfTransaction(dto: createTransactionDto) {
    const operation = dto.operation;

    switch (operation) {
      case 'transfer':
        return await this.transferStrategy.execute(dto);
      case 'deposit':
        return await this.depositStrategy.execute(dto);
      case 'expense':
        return await this.expenseStrategy.execute(dto);
      default:
        throw new BadRequestException('Not implemented operation');
    }
  }

  async getAllTransactions() {
    const transactions = await this.transactionModel.findAll();
    return transactions;
  }

  async getUsersTransactions(user_id: number) {
    return await this.transactionModel.findAll({
      where: {
        [Op.or]: [{ sender_card_id: user_id }, { receiver_card_id: user_id }],
      },
    });
  }
}
