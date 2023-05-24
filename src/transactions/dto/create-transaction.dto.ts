import { ApiProperty } from '@nestjs/swagger';

export class createTransactionDto {
  @ApiProperty({ example: 6, description: 'User ID' })
  readonly user_id: number;

  @ApiProperty({ example: 100, description: 'Transaction amount' })
  readonly transaction_amount: number;

  @ApiProperty({
    example: 'Payment for services',
    description: 'Transaction description',
  })
  readonly transaction_description: string;

  @ApiProperty({
    example: '5375498249717684',
    description: 'Receiver card number',
  })
  readonly receiver_card_number: string;
}
