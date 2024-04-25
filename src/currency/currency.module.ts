import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Currency } from './currency.model';
import { UserCurrency } from './userCurrency.model';
import { Card } from '../cards/card.model';
import { Transaction } from 'src/transactions/transactions.model';
import { CurrencyUtils } from './currency.utils';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService,CurrencyUtils],
  imports: [
    SequelizeModule.forFeature([Currency, UserCurrency, Card, Transaction]),
  ],
  exports: [CurrencyService],
})
export class CurrencyModule {}
