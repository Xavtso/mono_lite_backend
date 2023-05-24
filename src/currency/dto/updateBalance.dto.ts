import { ApiProperty } from '@nestjs/swagger';

export class updateCurrencyBalanceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  readonly user_id: number;

  @ApiProperty({ example: 1000, description: 'USD balance' })
  readonly usd_balance: number;

  @ApiProperty({ example: 800, description: 'EUR balance' })
  readonly eur_balance: number;

  @ApiProperty({ example: 500, description: 'Amount to update balance' })
  readonly amount: number;

  @ApiProperty({ example: 'USD', description: 'Currency code' })
  readonly currencyCode: string;
}
