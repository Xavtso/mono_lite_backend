import { Card } from 'src/cards/card.model';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { createTransactionDto } from './dto/create-transaction.dto';
import { CardsService } from 'src/cards/cards.service';
import { Op } from 'sequelize';
import { CashBack } from 'src/cashback/cashback.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Card) private cardRepository: typeof Card,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
    @InjectModel(CashBack) private cashBackModel: typeof CashBack,
    private cardService: CardsService,
  ) {}

  async createTransaction(dto: createTransactionDto) {
    const senderCard = await this.getCurrentCard(dto.user_id);
    const receiverCard = await this.getReceiverCard(dto);

    if (senderCard.blocked) {
      throw new ConflictException('Ви наказані!) - картку заблоковано!)');
    }

    if (receiverCard.card_number === senderCard.card_number) {
      throw new ConflictException('Ти шо,самий мудрий ?!');
    }
    const sender_full_name =
      senderCard.owner_name + ' ' + senderCard.owner_surname;
    const full_name =
      receiverCard.owner_name + ' ' + receiverCard.owner_surname;

    const amount = dto.transaction_amount;

    if (amount > senderCard.card_balance) {
      throw new ConflictException('Йди на роботу! -- Недостатньо коштів 💵');
    }

    const description = dto.transaction_description;
    const type = 'TRANSFER';

    const transaction = await this.transactionModel.sequelize.transaction();
    try {
      // здійснюємо зміни на картках користувачів
      await this.cardRepository.update(
        { card_balance: senderCard.card_balance - amount },
        { where: { card_id: senderCard.card_id }, transaction },
      );

      await this.cardRepository.update(
        { card_balance: +receiverCard.card_balance + +amount },
        { where: { card_id: receiverCard.card_id }, transaction },
      );

      // створюємо транзакцію в базі даних
      const createdTransaction = await this.transactionModel.create(
        {
          sender_card_id: senderCard.card_id,
          sender_full_name: sender_full_name,
          receiver_card_id: receiverCard.card_id,
          receiver_card_number: receiverCard.card_number,
          receiver_full_name: full_name,
          transaction_amount: amount,
          transaction_description: description,
          transaction_type: type,
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

  async getCurrentCard(id: number) {
    const currCard = await this.cardService.getCardById(id);
    return currCard;
  }

  async getReceiverCard(dto: createTransactionDto) {
    const receiverCard = await this.cardService.getCardByNumber(
      dto.receiver_card_number,
    );

    if (!receiverCard) {
      throw new NotFoundException(
        'Не шукай вітру в полі! -- Користувача з такою 💳 не знайдено.',
      );
    }

    if (receiverCard.blocked) {
      throw new ConflictException(
        'Стоїть в кутку - наказаний(а)! -- Цю карту заблоковано!',
      );
    }

    return receiverCard;
  }

  async getUsersTransactions(id: number) {
    console.log(id);
    const userCard = await this.getCurrentCard(id);
    const transactions = await this.transactionModel.findAll({
      where: {
        [Op.or]: [
          { sender_card_id: userCard.card_id },
          { receiver_card_id: userCard.card_id },
        ],
      },
    });
    return transactions;
  }

  async simulateDeposit(dto: createTransactionDto) {
    const currCard = await this.getCurrentCard(dto.user_id);
    const amount = dto.transaction_amount;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;

    if (amount > 50000) {
      throw new ConflictException('Нічого не злипнеться?!🍑');
    }
    if (!currCard.blocked) {
      await this.cardRepository.update(
        { card_balance: +currCard.card_balance + +amount },
        { where: { card_id: currCard.card_id } },
      );
    } else throw new ConflictException('Догралися! - картку заблоковано!)');

    if (currCard.card_balance < 2000000) {
      const createdTransaction = await this.transactionModel.create({
        sender_card_id: Math.random(),
        sender_full_name: full_name,
        receiver_card_id: currCard.card_id,
        receiver_card_number: currCard.card_number,
        receiver_full_name: 'GIFT 🎁',
        transaction_amount: amount,
        transaction_description: 'Симуляція поповнення рахунку',
        transaction_type: 'DEPOSIT',
      });
      return createdTransaction;
    } else {
      await this.cardRepository.update(
        { blocked: true, blockReason: 'Overdrafting' },
        { where: { card_id: currCard.card_id } },
      );
      throw new ConflictException('Догралися! - картку заблоковано!)');
    }
  }

  async simulateWithdrawal(dto: createTransactionDto) {
    const currCard = await this.getCurrentCard(dto.user_id);
    const amount = dto.transaction_amount;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;

    if (amount <= currCard.card_balance) {
      await this.cardRepository.update(
        { card_balance: currCard.card_balance - amount },
        { where: { card_id: currCard.card_id } },
      );

      await this.updateCashBackBalance(dto);

      const createdTransaction = await this.transactionModel.create({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.random(),
        receiver_card_number: '537568651241322777',
        receiver_full_name: 'Expension 💵',
        transaction_amount: amount,
        transaction_description: 'Симуляція витрат',
        transaction_type: 'EXPENSE',
      });
      return createdTransaction;
    }
    const dontEnough = amount - currCard.card_balance;
    throw new ConflictException(`До повного щастя вам бракує ${dontEnough} ₴`);
  }

  async getAllTransactions() {
    const transactions = await this.transactionModel.findAll();
    return transactions;
  }

  async updateCashBackBalance(dto: createTransactionDto) {
    const currCard = await this.getCurrentCard(dto.user_id);
    const amount = +dto.transaction_amount;
    const [currCashBackVault, created] = await this.cashBackModel.findOrCreate({
      where: { card_id: currCard.card_id },
      defaults: { cashback_balance: 0 },
    });

    await this.cashBackModel.update(
      {
        cashback_balance: currCashBackVault.cashback_balance + +amount * 0.02,
      },
      { where: { card_id: currCard.card_id } },
    );
  }
}
