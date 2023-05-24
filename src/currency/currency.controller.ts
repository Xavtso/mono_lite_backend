import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { currencyDto } from './dto/currency.dto';
import { CurrencyService } from './currency.service';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { Currency } from './currency.model';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @ApiBody({ type: [Currency] })
  @ApiResponse({ status: 200, description: 'Successfully updated currencies info' })
  @Post('')
  async updateCurrencyInfo(@Body() dto: currencyDto) {
    return await this.currencyService.updateCurrency(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved currency information',
  })
  @Get('/info')
  async sendInfo() {
    return await this.currencyService.sendCurrencyInfo();
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user currency entity',
  })
  @Get('/:id')
  async getUserCurrencyEntity(@Param('id') id: number) {
    return await this.currencyService.getUserCurrencyEntity(id);
  }

  @ApiBody({ type: updateCurrencyBalanceDto })
  @ApiResponse({ status: 200, description: 'Successfully sold currency' })
  @Post('/sell')
  async sellCurrency(@Body() dto: updateCurrencyBalanceDto) {
    return await this.currencyService.sellCurrency(dto);
  }

  @ApiBody({ type: updateCurrencyBalanceDto })
  @ApiResponse({ status: 200, description: 'Successfully bought currency' })
  @Post('/buy')
  async buyCurrency(@Body() dto: updateCurrencyBalanceDto) {
    return await this.currencyService.buyCurrency(dto);
  }
}
