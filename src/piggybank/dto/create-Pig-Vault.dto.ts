import { ApiProperty } from '@nestjs/swagger';

export class createPigVaultDto {
  @ApiProperty({ example: 3, description: 'User ID' })
  readonly user_id: number;

  @ApiProperty({ example: 100, description: 'Amount' })
  readonly amount: number;

  @ApiProperty({ example: 1000, description: 'Target Sum' })
  readonly target_sum: number;

  @ApiProperty({ example: 'My Piggy Bank', description: 'Vault Title' })
  readonly vault_title: string;

  @ApiProperty({ example: 1, description: 'Vault ID' })
  readonly vault_id: number;

  @ApiProperty({ example: 5, description: 'Contributors' })
  readonly contributors: number;
}
