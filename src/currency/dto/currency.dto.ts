import { ApiProperty } from '@nestjs/swagger';

export class currencyDto {
  @ApiProperty({ example: 1, description: 'Currency ID' })
  readonly currency_id: number;

  @ApiProperty({ example: 1679483600, description: 'Date' })
  readonly date: number;

  @ApiProperty({ example: 27.5, description: 'Sell rate' })
  readonly rateSell: number;

  @ApiProperty({ example: 26.8, description: 'Buy rate' })
  readonly rateBuy: number;
}
