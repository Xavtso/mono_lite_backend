import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CashBack } from '../cashback.model';

@Injectable()
export class CashBackUtils {
  constructor(@InjectModel(CashBack) private cashbackModel: typeof CashBack) {}
  async getUserCashBack(id: number) {
    const [currCashBackVault, created] = await this.cashbackModel.findOrCreate({
      where: { card_id: id },
      defaults: { cashback_balance: 0 },
    });
    return currCashBackVault;
  }
  async addCashBackBalance(model: CashBack, amount: number) {
    return await model.update({
      cashback_balance: model.cashback_balance + amount,
    });
  }
  async withdrawCashBackBalance(model: CashBack, amount: number) {
    return await model.update({
      cashback_balance: model.cashback_balance - amount,
    });
  }
}
