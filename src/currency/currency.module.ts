import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Currency } from './currency.model';
import { UserCurrency } from './userCurrency.model';
import { Card } from 'src/cards/card.model';
import { Transaction } from 'src/transactions/transactions.model';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  imports: [SequelizeModule.forFeature([Currency,UserCurrency,Card,Transaction])],
  exports: [CurrencyService],
})
export class CurrencyModule {}
