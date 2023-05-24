import { ApiProperty } from '@nestjs/swagger';

export class CashBackDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  readonly user_id: number;

  @ApiProperty({ example: 100, description: 'Cashback amount' })
  readonly amount: number;
}
