import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PiggyBank } from '../piggybank.model';


@Injectable()
export class JarUtils {
  constructor(
    @InjectModel(PiggyBank) private jarModel: typeof PiggyBank,
  ) {}
  async getTargetJar(id: number) {
    return await this.jarModel.findOne({ where: { vault_id: id } });
  }
  async addToJar(jar: PiggyBank, amount: number) {
    return await jar.update({ vault_balance: jar.vault_balance + amount });
  }
  async withdrawFromJar(jar: PiggyBank, amount: number) {
    return await jar.update({ vault_balance: jar.vault_balance - amount });
  }
  async breakJar(jar: PiggyBank) {
    return await jar.destroy();
  }
}
