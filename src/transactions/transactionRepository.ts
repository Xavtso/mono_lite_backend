import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { CashBack } from 'src/cashback/cashback.model';

export interface TransactionInterface {
  sender_card_id: number;
  sender_full_name: string;
  receiver_card_id: number;
  receiver_card_number: string;
  receiver_full_name: string;
  transaction_amount: number;
  transaction_description: string;
  transaction_type:
    | 'TRANSFER'
    | 'DEPOSIT'
    | 'EXPENSE'
    | 'PIG-BANK'
    | 'LOAN'
  | 'CASH-BACK'
  |'deposit'
}

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async createTransactionRecord(dto: TransactionInterface) {
    const transaction = await this.transactionModel.sequelize.transaction();
    try {
      const createdTransaction = await this.transactionModel.create(
        {
          sender_card_id: dto.sender_card_id,
          sender_full_name: dto.sender_full_name,
          receiver_card_id: dto.receiver_card_id,
          receiver_card_number: dto.receiver_card_number,
          receiver_full_name: dto.receiver_full_name,
          transaction_amount: dto.transaction_amount,
          transaction_description: dto.transaction_description,
          transaction_type: dto.transaction_type,
        },
        { transaction },
      );

      // комітуємо транзакцію, якщо все успішно
      await transaction.commit();

      return createdTransaction;
    } catch (error) {
      // робимо rollback транзакції в разі помилки
      await transaction.rollback();
      throw error;
    }
  }
}
