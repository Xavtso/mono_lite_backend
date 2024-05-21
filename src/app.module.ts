import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.model';
import { Card } from './cards/card.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transactions.model';
import { AuthModule } from './auth/auth.module';
import { PiggybankModule } from './piggybank/piggybank.module';
import { CashbackModule } from './cashback/cashback.module';
import { CashBack } from './cashback/cashback.model';
import { PiggyBank } from './piggybank/piggybank.model';
import { LoansModule } from './loans/loans.module';
import { DepositsModule } from './deposits/deposits.module';
import { Loan } from './loans/loans.model';
import { Deposit } from './deposits/deposit.model';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencyModule } from './currency/currency.module';
import { Currency } from './currency/currency.model';
import { UserCurrency } from './currency/userCurrency.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({}),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        dialect: 'postgres',
        host: 'localhost',
        database: 'mono_db',
        username: 'postgres',
        password: 'vh2004r44',
        port: 5432,
        models: [
          User,
          Card,
          Transaction,
          CashBack,
          PiggyBank,
          Loan,
          Deposit,
          Currency,
          UserCurrency,
        ],
        autoLoadModels: true,
      }),
    }),
    UsersModule,
    CardsModule,
    AuthModule,
    TransactionsModule,
    PiggybankModule,
    CashbackModule,
    LoansModule,
    DepositsModule,
    CurrencyModule,
  ],
  exports: [AuthModule],
})
export class AppModule {}
