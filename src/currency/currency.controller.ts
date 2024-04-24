import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';
import { CurrencyUtils } from './currency.utils';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(
    private currencyService: CurrencyService,
    private utils: CurrencyUtils,
  ) {}

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
    return await this.utils.getUserEntity(id);
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
