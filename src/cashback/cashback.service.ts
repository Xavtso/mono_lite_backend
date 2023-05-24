import { ConflictException,Injectable ,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CashBack } from './cashback.model';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CashBackDto } from './dto/cashBack.dto';
import { Transaction } from 'src/transactions/transactions.model';
import { Card } from 'src/cards/card.model';

@Injectable()
export class CashbackService {
  constructor(
    @InjectModel(CashBack) private cashbackModel: typeof CashBack,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
    @InjectModel(Card) private cardModel: typeof Card,
    private transactionService: TransactionsService,
  ) {}

 

  async getCashBackToBalance(dto: CashBackDto) {
    const amount = dto.amount;
    const currCard = await this.transactionService.getCurrentCard(dto.user_id);
    const currStorage = await this.cashbackModel.findOne({
      where: { card_id: currCard.card_id },
    });

    if (
      currStorage.cashback_balance >= 100 &&
      currStorage.cashback_balance >= amount
    ) {
      
      await this.cashbackModel.update(
        { cashback_balance: currStorage.cashback_balance - amount },
        { where: { cashback_id: currStorage.cashback_id } },
      );

      await this.cardModel.update(
        { card_balance: +currCard.card_balance + amount - amount * 0.15 },
        { where: { card_id: currCard.card_id } },
      );

      const transaction = await this.transactionModel.create({
        sender_card_id: Math.random(),
        sender_full_name: 'CASH-BACK',
        receiver_card_id: currCard.card_id,
        receiver_card_number: currCard.card_number,
        receiver_full_name: currCard.owner_name + ' ' + currCard.owner_surname,
        transaction_amount: amount - amount * 0.15,
        transaction_description: 'Кешбек🎉💵',
        transaction_type: 'CASH-BACK',
      });

      return transaction;
    } else if (currStorage.cashback_balance < amount) {
      throw new BadRequestException('Ти кого хочеш намахати?');
    }
  }

  async showBalance(id:number) {
    const currCard = await this.transactionService.getCurrentCard(id);
    const [currCashBackVault, created] = await this.cashbackModel.findOrCreate({
      where: { card_id: currCard.card_id },
      defaults: { cashback_balance: 0 },
    });
    const balance = currCashBackVault.cashback_balance;
    return balance;
  }
}
