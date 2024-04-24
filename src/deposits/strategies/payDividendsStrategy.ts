import { Injectable } from '@nestjs/common';
import { DepositStrategy } from '.';
import { DepositUtils } from '../utils';

@Injectable()
export class PayDividentsStrategy implements DepositStrategy {
  constructor(private depositUtils: DepositUtils) {}
  async execute(): Promise<string> {
    const vaults = await this.depositUtils.getAllVaults();
    try {
      vaults.map((vault) =>
        vault.end_date < new Date()
          ? this.depositUtils.makeTransaction(
              'dividends',
              vault.user_id,
              vault.monthly_payment,
            )
          : vault.destroy(),
      );
      return 'All dividents have been paid!';
    } catch (error) {
      throw new Error('Some error with dividents occured');
    }
  }
}
