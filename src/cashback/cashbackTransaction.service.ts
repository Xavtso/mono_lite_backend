import { Injectable, BadRequestException } from '@nestjs/common';
import { CashBackDto } from './dto/cashBack.dto';
import { CashbackStorage } from './cashbackStorage.service';
import { CardUtils } from '../cards/card.utils';
import { CashBackUtils } from './utils';
import { TransactionRepository } from '../transactions/transactionRepository';

@Injectable()
export class CashbackTransactions {
  private readonly CASHBACK_FEE_PERCENTAGE = 0.15;
  private readonly CASHBACK_PERCENTAGE = 0.02;

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

    await this.ensureSufficientBalance(currCard.card_id, amount);

    try {
      await this.cashbackUtils.withdrawCashBackBalance(currStorage, amount);
      const calcAmount = this.calculateNetAmount(amount);
      await this.cardUtils.addBalanceToCard(currCard, calcAmount);

      await this.createTransactionRecord(currCard, calcAmount);

      return 'Transaction Successful';
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Transaction Failed');
    }
  }

  private async ensureSufficientBalance(card_id: number, amount: number) {
    const isBalanceSufficient =
      await this.cashbackStorageService.isBalanceSufficient(card_id, amount);
    if (!isBalanceSufficient) {
      throw new BadRequestException('Ти кого хочеш намахати?');
    }
  }

  private calculateNetAmount(amount: number): number {
    return amount - amount * this.CASHBACK_FEE_PERCENTAGE;
  }

  private async createTransactionRecord(currCard, calcAmount: number) {
    await this.transactionRepository.createTransactionRecord({
      sender_card_id: Math.random(),
      sender_full_name: 'CASH-BACK',
      receiver_card_id: currCard.card_id,
      receiver_card_number: currCard.card_number,
      receiver_full_name: `${currCard.owner_name} ${currCard.owner_surname}`,
      transaction_amount: calcAmount,
      transaction_description: 'Кешбек🎉💵',
      transaction_type: 'CASH-BACK',
    });
  }

  async updateCashBackBalance(id: number, amount: number) {
    const currStorage = await this.cashbackUtils.getUserCashBack(id);
    const calcAmount = amount * this.CASHBACK_PERCENTAGE;
    await this.cashbackUtils.addCashBackBalance(currStorage, calcAmount);
    return 'Balance Updated';
  }
}







// Extract Method :
// Виділив логіку перевірки достатнього балансу в метод ensureSufficientBalance.
// Виділив логіку обчислення суми з вирахуванням комісії в метод calculateNetAmount.
// Виділив логіку створення запису транзакції в метод createTransactionRecord.

// Replace Magic Number with Symbolic Constant
// Додав константи CASHBACK_FEE_PERCENTAGE та CASHBACK_PERCENTAGE.

// Error Handling Improvement :
// Додав обробку помилок для випадків, коли транзакція не вдалася.