import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Deposit } from './deposit.model';
import { createDepositDto } from './dto/createDeposit.dto';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { CreateDepositStrategy } from './strategies/createDepositStrategy';
import { UpdateDepositStrategy } from './strategies/updateDepositStrategy';
import { PayDividentsStrategy } from './strategies/payDividendsStrategy';
import { DestroyVaultStrategy } from './strategies/destroyVaultStrategy';

@Injectable()
export class DepositsService {
  constructor(
    @InjectModel(Deposit) private depositModel: typeof Deposit,
    private createDepositStrategy: CreateDepositStrategy,
    private updateDepositStrategy: UpdateDepositStrategy,
    private payDividentsStrategy: PayDividentsStrategy,
    private destroyVaultStrategy: DestroyVaultStrategy,
  ) {}

  async createDeposit(dto: createDepositDto) {
    return await this.createDepositStrategy.execute(dto);
  }

  async updateAmountOfDeposit(dto: createDepositDto) {
    return await this.updateDepositStrategy.execute(dto);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async payPercentage() {
    return await this.payDividentsStrategy.execute();
  }

  async showUserVaults(id: number) {
    const vaults = await this.depositModel.findAll({ where: { user_id: id } });
    return vaults;
  }

  async destroyVault(dto: createDepositDto) {
    return await this.destroyVaultStrategy.execute(dto);
  }
}
