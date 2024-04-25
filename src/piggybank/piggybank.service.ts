import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PiggyBank } from './piggybank.model';
import { createPigVaultDto } from './dto/create-Pig-Vault.dto';
import { Op } from 'sequelize';
import {
  CreateVaultCommand,
  DepositToJarCommand,
  breakJarCommand,
  withdrawCommand,
} from './commands/jarCommands';
import { TransactionRepository } from '../transactions/transactionRepository';
import { JarUtils } from './utils';
import { CardUtils } from '../cards/card.utils';

@Injectable()
export class PiggybankService {
  constructor(
    @InjectModel(PiggyBank) private vaultModel: typeof PiggyBank,
    private transactionRepository: TransactionRepository,
    private jarUtils: JarUtils,
    private cardUtils: CardUtils,
  ) {}

  async createVault(dto: createPigVaultDto) {
    const command = new CreateVaultCommand(this.vaultModel, dto);
    return await command.execute();
  }

  async depositToJar(dto: createPigVaultDto) {
    const command = new DepositToJarCommand(
      this.transactionRepository,
      this.cardUtils,
      dto,
      this.jarUtils,
    );
    return await command.execute();
  }

  async withdrawFromJar(dto: createPigVaultDto) {
    const command = new withdrawCommand(
      dto,
      this.jarUtils,
      this.cardUtils,
      this.transactionRepository,
    );
    return await command.execute();
  }

  async breakJar(dto: createPigVaultDto) {
    const command = new breakJarCommand(
      dto,
      this.jarUtils,
      this.cardUtils,
      this.transactionRepository,
    );
    return await command.execute();
  }

  async showUserVaults(user_id: number) {
    const vaults = await this.vaultModel.findAll({
      where: {
        [Op.or]: [{ user_id: user_id }, { contributors: user_id }],
      },
    });
    return vaults;
  }

  async getAllVaults() {
    return await this.vaultModel.findAll();
  }

  async changeJarCredentials(dto: createPigVaultDto) {
    try {
      const targetVault = await this.vaultModel.findByPk(dto.vault_id);
      const isOwner = +dto.user_id === targetVault.user_id;
      if (targetVault && isOwner) {
        const updatedVault = await this.vaultModel.update(
          { ...dto },
          { where: { vault_id: targetVault.vault_id } },
        );
        return updatedVault;
      }
    } catch (error) {
      throw new NotFoundException('Vault does not exist');
    }
  }
}
