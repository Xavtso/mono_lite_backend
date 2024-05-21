import { Injectable, BadRequestException } from '@nestjs/common';
import { CashBackDto } from './dto/cashBack.dto';
import { CashbackStorage } from './cashbackStorage.service';
import { CardUtils } from '../cards/card.utils';
import { CashBackUtils } from './utils';
import { TransactionRepository } from '../transactions/transactionRepository';

@Injectable()
export class CashbackTransactions {
  constructor(
    private transactionRepository: TransactionRepository,
    private cashbackUtils: CashBackUtils,
    private cardUtils: CardUtils,
    private cashbackStorageService: CashbackStorage,
  ) {}

  async getCashBackToBalance({ amount, user_id }: CashBackDto) {
    const currCard = await this.cardUtils.getUserCard(user_id);
    const currStorage = await this.cashbackUtils.getUserCashBack(
      currCard.card_id,
    );

    const isBalanceSufficient =
      await this.cashbackStorageService.isBalanceSufficient(
        currCard.card_id,
        amount,
      );
    if (!isBalanceSufficient)
      throw new BadRequestException('Ти кого хочеш намахати?');

    try {
      await this.cashbackUtils.withdrawCashBackBalance(currStorage, amount);

      const calcAmount = amount - amount * 0.15;
      await this.cardUtils.addBalanceToCard(currCard, calcAmount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: Math.random(),
        sender_full_name: 'CASH-BACK',
        receiver_card_id: currCard.card_id,
        receiver_card_number: currCard.card_number,
        receiver_full_name: `${currCard.owner_name} ${currCard.owner_surname}`,
        transaction_amount: amount - amount * 0.15,
        transaction_description: 'Кешбек🎉💵',
        transaction_type: 'CASH-BACK',
      });

      return 'Transaction Succesfull';
    } catch (error) {
      console.log(error);
    }
  }

  async updateCashBackBalance(id: number, amount: number) {
    const currStorage = await this.cashbackUtils.getUserCashBack(id);
    const calcAmount = amount * 0.02;
    await this.cashbackUtils.addCashBackBalance(currStorage, calcAmount);
    return 'Balance Updated';
  }
}

// Фасад CashbackTransactions забезпечує обгортку для виконання складних операцій з кешбеком,
//  спрощуючи використання цих операцій в інших частинах програми.
// Він ізолює клієнтів від складності внутрішньої реалізації, яка складається з взаємодії з базою даних та іншими сервісами.

// Також, використання сервісу CashbackStorage допомагає розділити логіку перевірки балансу кешбеку від інших операцій,
//  що забезпечує принцип єдиного обов'язку та полегшує відладку та тестування.
