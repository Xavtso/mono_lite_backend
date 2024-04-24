import { Injectable, ConflictException } from '@nestjs/common';
import { Card } from 'src/cards/card.model';
import { createTransactionDto } from '../dto/create-transaction.dto';
import { TransactionRepository } from '../transactionRepository';
import { TransactionUtils } from '../transactionUtils.service';
import { CardUtils } from 'src/cards/card.utils';
import { CashbackTransactions } from 'src/cashback/cashbackTransaction.service';

interface TransactionStrategy {
  execute(dto: createTransactionDto): Promise<any>;
}

@Injectable()
export class TransferStrategy implements TransactionStrategy {
  constructor(
    private utils: TransactionUtils,
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute(dto: createTransactionDto): Promise<any> {
    const senderCard = await this.cardUtils.getUserCard(dto.user_id);
    const receiverCard = await this.utils.getReceiverCard(dto);

    if (senderCard.blocked) {
      throw new ConflictException('Ви наказані!) - картку заблоковано!)');
    }

    if (receiverCard.card_number === senderCard.card_number) {
      throw new ConflictException('Ти шо,самий мудрий ?!');
    }

    const sender_full_name = `${senderCard.owner_name} ${senderCard.owner_surname}`;
    const full_name = `${receiverCard.owner_name} ${receiverCard.owner_surname}`;
    const amount = dto.transaction_amount;
    const type = 'TRANSFER';

    if (amount > senderCard.card_balance) {
      throw new ConflictException('Йди на роботу! -- Недостатньо коштів 💵');
    }

    try {
      await this.cardUtils.withdrawBalanceFromCard(senderCard, amount);
      await this.cardUtils.addBalanceToCard(receiverCard, amount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: senderCard.card_id,
        sender_full_name: sender_full_name,
        receiver_card_id: receiverCard.card_id,
        receiver_card_number: receiverCard.card_number,
        receiver_full_name: full_name,
        transaction_amount: amount,
        transaction_description: dto.transaction_description,
        transaction_type: type,
      });

      return 'Transfer Succesfull';
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class DepositStrategy implements TransactionStrategy {
  constructor(
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute({
    transaction_amount,
    user_id,
  }: createTransactionDto): Promise<any> {
    const currCard = await this.cardUtils.getUserCard(user_id);
    const full_name = `${currCard.owner_name} ${currCard.owner_surname}`;

    if (transaction_amount > 50000) {
      throw new ConflictException('Нічого не злипнеться?!🍑');
    }

    if (currCard.blocked) {
      throw new ConflictException('Догралися! - картку заблоковано!)');
    }

    await this.cardUtils.addBalanceToCard(currCard, transaction_amount);

    await this.transactionRepository.createTransactionRecord({
      sender_card_id: Math.round(Math.random()),
      sender_full_name: full_name,
      receiver_card_id: currCard.card_id,
      receiver_card_number: currCard.card_number,
      receiver_full_name: 'GIFT 🎁',
      transaction_amount: transaction_amount,
      transaction_description: 'Симуляція поповнення рахунку',
      transaction_type: 'DEPOSIT',
    });

    return 'Transaction Succesfull';
  }
}

@Injectable()
export class ExpenseStrategy implements TransactionStrategy {
  constructor(
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
    private cashbackService: CashbackTransactions,
  ) {}

  async execute({
    transaction_amount,
    user_id,
  }: createTransactionDto): Promise<any> {
    const currCard = await this.cardUtils.getUserCard(user_id);
    const full_name = `${currCard.owner_name} ${currCard.owner_surname}`;

    if (transaction_amount > currCard.card_balance) {
      throw new ConflictException(
        `До повного щастя вам бракує ${
          transaction_amount - currCard.card_balance
        } ₴`,
      );
    }
    try {
      await this.cardUtils.withdrawBalanceFromCard(
        currCard,
        transaction_amount,
      );

      await this.cashbackService.updateCashBackBalance(
        currCard.card_id,
        transaction_amount,
      );

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.round(Math.random()),
        receiver_card_number: '537568651241322777',
        receiver_full_name: 'Expension 💵',
        transaction_amount: transaction_amount,
        transaction_description: 'Симуляція витрат',
        transaction_type: 'EXPENSE',
      });

      return 'Operation Successful';
    } catch (error) {
      throw new Error('Some error occured');
    }
  }
}
