import { ApiProperty } from '@nestjs/swagger';

export class createDepositDto {
  @ApiProperty({ example: 1, description: 'Deposit ID' })
  readonly id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  readonly user_id: number;

  @ApiProperty({ example: 1000.0, description: 'Deposit amount' })
  readonly amount: number;

  @ApiProperty({ example: 5.5, description: 'Interest rate' })
  readonly interest_rate: number;

  @ApiProperty({ example: 12, description: 'Deposit term in months' })
  readonly term: number;
}
