import { Module, forwardRef } from '@nestjs/common';
import { PiggybankService } from './piggybank.service';
import { PiggybankController } from './piggybank.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PiggyBank } from './piggybank.model';
import { User } from 'src/users/user.model';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CardsModule } from 'src/cards/cards.module';
import { Card } from 'src/cards/card.model';
import { Transaction } from 'src/transactions/transactions.model';
import { TransactionRepository } from 'src/transactions/transactionRepository';
import { JarUtils } from './utils';
import { CardUtils } from 'src/cards/card.utils';

@Module({
  providers: [PiggybankService, TransactionRepository, JarUtils, CardUtils],
  controllers: [PiggybankController],
  imports: [
    SequelizeModule.forFeature([PiggyBank, User, Card, Transaction]),
    forwardRef(() => TransactionsModule),
    forwardRef(() => CardsModule),
  ],
  exports: [PiggybankService],
})
export class PiggybankModule {}
