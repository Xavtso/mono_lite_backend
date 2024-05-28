import { updateCurrencyBalanceDto } from './dto/updateBalance.dto';

export interface CurrencyState {
  buy(dto: updateCurrencyBalanceDto): any;
  sell(dto: updateCurrencyBalanceDto): any;
}

