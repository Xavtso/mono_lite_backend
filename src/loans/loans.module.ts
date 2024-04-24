import { Module, forwardRef } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/cards/card.model';
import { Loan } from './loans.model';
import { CardsModule } from 'src/cards/cards.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Transaction } from 'src/transactions/transactions.model';
import { LoanUtils } from './utils';
import { PayFulllLoanStrategy } from './strategies/payFullStrategy';
import { PayPartialLoanStrategy } from './strategies/payPartStrategy';
import { CreateLoanStrategy } from './strategies/createLoanStrategy';
import { CardUtils } from 'src/cards/card.utils';
import { TransactionRepository } from 'src/transactions/transactionRepository';

@Module({
  providers: [
    LoansService,
    LoanUtils,
    PayFulllLoanStrategy,
    PayPartialLoanStrategy,
    CreateLoanStrategy,
    CardUtils,
    TransactionRepository,
  ],
  controllers: [LoansController],
  imports: [
    forwardRef(() => CardsModule),
    forwardRef(() => TransactionsModule),
    SequelizeModule.forFeature([Loan, Card, Transaction]),
  ],
  exports: [LoansService],
})
export class LoansModule {}
