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
import * as tedious from 'tedious';
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
        dialect: 'mssql',
        dialectModule: tedious,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: 1433,
        database: process.env.DB,
        dialectOptions: {
          driver: {
            version: 'ODBC Driver 18 for SQL Server',
          },
          options: {
            encrypt: true,
            authentication: {
              type: 'azure-active-directory-msi-app-service',
            },
          },
          encrypt: true,
          trustServerCertificate: false,
        },
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
