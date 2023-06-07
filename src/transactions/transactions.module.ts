import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { Card } from 'src/cards/card.model';
import { CardsModule } from 'src/cards/cards.module';
import { CashbackModule } from 'src/cashback/cashback.module';
import { CashBack } from 'src/cashback/cashback.model';
import { User } from 'src/users/user.model';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    forwardRef(() => CardsModule),
    forwardRef(() => CashbackModule),

    SequelizeModule.forFeature([Transaction, Card, CashBack, User]),
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
