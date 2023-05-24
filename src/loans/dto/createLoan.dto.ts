import { ApiProperty } from '@nestjs/swagger';

export class createLoanDto {
  @ApiProperty({ description: 'Loan ID', example: 1 })
  readonly id: number;

  @ApiProperty({ description: 'Borrower ID', example: 1 })
  readonly borrower_id: number;

  @ApiProperty({ description: 'Loan amount', example: 1000 })
  readonly amount: number;

  @ApiProperty({ description: 'Interest rate', example: 5 })
  readonly interest_rate: number;

  @ApiProperty({ description: 'Loan term (in months)', example: 12 })
  readonly term: number;
}
