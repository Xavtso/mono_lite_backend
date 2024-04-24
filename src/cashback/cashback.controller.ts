import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CashBackDto } from './dto/cashBack.dto';
import { CashbackTransactions } from './cashbackTransaction.service';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CashBack } from './cashback.model';
import { CashbackStorage } from './cashbackStorage.service';

@ApiTags('Cashback')
@Controller('cashback')
export class CashbackController {
  constructor(
    private cashbackTransactions: CashbackTransactions,
    private cashbackStorage: CashbackStorage,
  ) {}

  @Post('/withdraw')
  @ApiBody({ type: [CashBack] })
  @ApiResponse({ status: 200, description: 'Cashback retrieved successfully' })
  getCashBack(@Body() dto: CashBackDto) {
    return this.cashbackTransactions.getCashBackToBalance(dto);
  }

  @Get('/balance/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  getBalance(@Param('id') id: number) {
    return this.cashbackStorage.getBalance(id);
  }
}
