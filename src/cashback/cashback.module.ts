import { Module, forwardRef } from '@nestjs/common';
import { CashbackController } from './cashback.controller';
import { CashbackTransactions } from './cashbackTransaction.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from 'src/transactions/transactions.model';
import { CashBack } from './cashback.model';
import { Card } from '../cards/card.model';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CardsModule } from '../cards/cards.module';
import { CashbackStorage } from './cashbackStorage.service';
import { CashBackUtils } from './utils';
import { CardUtils } from '../cards/card.utils';
import { TransactionRepository } from 'src/transactions/transactionRepository';

@Module({
  controllers: [CashbackController],
  providers: [
    CashbackTransactions,
    CashbackStorage,
    CashBackUtils,
    CardUtils,
    TransactionRepository,
  ],
  imports: [
    forwardRef(() => TransactionsModule),
    forwardRef(() => CardsModule),
    SequelizeModule.forFeature([Card, CashBack, Transaction]),
  ],
  exports: [CashbackTransactions],
})
export class CashbackModule {}
