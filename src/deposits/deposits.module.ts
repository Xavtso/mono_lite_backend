import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Deposit } from './deposit.model';
import { Card } from 'src/cards/card.model';
import { Transaction } from 'src/transactions/transactions.model';

@Module({
  providers: [DepositsService],
  controllers: [DepositsController],
  imports: [SequelizeModule.forFeature([Deposit, Card, Transaction])],
  exports: [DepositsService],
})
export class DepositsModule {}
