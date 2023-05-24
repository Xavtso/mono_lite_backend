import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CashBackDto } from './dto/cashBack.dto';
import { CashbackService } from './cashback.service';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CashBack } from './cashback.model';

@ApiTags('Cashback')
@Controller('cashback')
export class CashbackController {
  constructor(private cashbackService: CashbackService) {}

  @Post()
  @ApiBody({ type: [CashBack] })
  @ApiResponse({ status: 200, description: 'Cashback retrieved successfully' })
  getCashBack(@Body() dto: CashBackDto) {
    return this.cashbackService.getCashBackToBalance(dto);
  }

  @Get('/balance/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  getBalance(@Param('id') id: number) {
    return this.cashbackService.showBalance(id);
  }
}
