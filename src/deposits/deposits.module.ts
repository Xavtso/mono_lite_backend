import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Deposit } from './deposit.model';
import { Card } from '../cards/card.model';
import { Transaction } from 'src/transactions/transactions.model';
import { DepositUtils } from './utils';
import { CardUtils } from '../cards/card.utils';
import { DestroyVaultStrategy } from './strategies/destroyVaultStrategy';
import { UpdateDepositStrategy } from './strategies/updateDepositStrategy';
import { CreateDepositStrategy } from './strategies/createDepositStrategy';
import { PayDividentsStrategy } from './strategies/payDividendsStrategy';
import { TransactionRepository } from 'src/transactions/transactionRepository';

@Module({
  providers: [
    DepositsService,
    DepositUtils,
    DestroyVaultStrategy,
    UpdateDepositStrategy,
    CreateDepositStrategy,
    PayDividentsStrategy,
    CardUtils,
    TransactionRepository,
  ],
  controllers: [DepositsController],
  imports: [SequelizeModule.forFeature([Deposit, Card, Transaction])],
  exports: [DepositsService],
})
export class DepositsModule {}
