import { Injectable } from '@nestjs/common';
import { DepositStrategy } from '.';
import { DepositUtils } from '../utils';
import { createDepositDto } from '../dto/createDeposit.dto';

@Injectable()
export class DestroyVaultStrategy implements DepositStrategy {
  constructor(private depositUtils: DepositUtils) {}
  async execute(dto: createDepositDto): Promise<string> {
    const vault = await this.depositUtils.getTargetVault(dto.user_id);
    try {
      await this.depositUtils.makeTransaction(
        'dividends',
        vault.user_id,
        vault.amount,
      );
      await vault.destroy();
      return 'Deposit Successfully Destroyed!';
    } catch (error) {
      console.log(error);
    }
  }
}
