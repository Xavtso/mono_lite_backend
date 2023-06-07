import { Module, forwardRef } from '@nestjs/common';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from 'src/transactions/transactions.model';
import { CashBack } from './cashback.model';
import { Card } from 'src/cards/card.model';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  controllers: [CashbackController],
  providers: [CashbackService],
  imports: [
    forwardRef(() => TransactionsModule),
    forwardRef(() => CardsModule),
    SequelizeModule.forFeature([Card, CashBack, Transaction]),
  ],
  exports: [CashbackService],
})
export class CashbackModule {}
