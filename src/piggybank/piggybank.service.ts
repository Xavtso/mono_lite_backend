import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PiggyBank } from './piggybank.model';
import { createPigVaultDto } from './dto/create-Pig-Vault.dto';
import { Card } from 'src/cards/card.model';
import { CardsService } from 'src/cards/cards.service';
import { Transaction } from 'src/transactions/transactions.model';
import { Op } from 'sequelize';

@Injectable()
export class PiggybankService {
  constructor(
    @InjectModel(PiggyBank) private vaultModel: typeof PiggyBank,
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(Transaction) private transactionsModel: typeof Transaction,
    private cardService: CardsService,
  ) {}

  async createVault(dto: createPigVaultDto) {
    const vault = await this.vaultModel.create({
      user_id: dto.user_id,
      target_sum: dto.target_sum,
      vault_title: dto.vault_title,
    });
    return vault;
  }

  async depositToVault(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findOne({
      where: { vault_id: dto.vault_id },
    });
    const amount = dto.amount;
    const currCard = await this.cardService.getCardById(dto.user_id);
    const isEnough = amount <= currCard.card_balance;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;

    if (targetVault && currCard && isEnough) {
      await this.cardModel.update(
        { card_balance: currCard.card_balance - amount },
        { where: { card_id: currCard.card_id } },
      );

      await this.vaultModel.update(
        { vault_balance: targetVault.vault_balance + amount },
        { where: { vault_id: targetVault.vault_id } },
      );

      const createdTransaction = await this.transactionsModel.create({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.random(),
        receiver_card_number: ' ',
        receiver_full_name: targetVault.vault_title,
        transaction_amount: amount,
        transaction_description: `Поповнення моно-банки: ${targetVault.vault_title}`,
        transaction_type: 'PIG-BANK',
      });
      return createdTransaction;
    }
  }
  async withdrawFromVault(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findOne({
      where: { vault_id: dto.vault_id },
    });
    const isOwner = targetVault.user_id === dto.user_id;
    const amount = dto.amount;
    const currCard = await this.cardService.getCardById(dto.user_id);
    const isEnough = amount <= targetVault.vault_balance;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;

    if (targetVault && currCard && isEnough && isOwner) {
      await this.cardModel.update(
        { card_balance: currCard.card_balance + amount },
        { where: { card_id: currCard.card_id } },
      );

      await this.vaultModel.update(
        { vault_balance: targetVault.vault_balance - amount },
        { where: { vault_id: targetVault.vault_id } },
      );

      const createdTransaction = await this.transactionsModel.create({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.random(),
        receiver_card_number: ' ',
        receiver_full_name: targetVault.vault_title,
        transaction_amount: amount,
        transaction_description: `Зняття частини з банки: ${targetVault.vault_title}`,
        transaction_type: 'PIG-BANK',
      });
      return createdTransaction;
    }
    if (!isEnough) {
      throw new BadRequestException('Недостатньо грошей у банці! ');
    }
    if (!isOwner) {
      throw new BadRequestException('Не твоє не чіпай!');
    }
  }

  async breakVault(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findOne({
      where: { vault_id: dto.vault_id },
    });
    const currCard = await this.cardService.getCardById(dto.user_id);
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;
    try {
      if (targetVault.user_id === dto.user_id) {
        await this.cardModel.update(
          { card_balance: currCard.card_balance + targetVault.vault_balance },
          { where: { card_id: currCard.card_id } },
        );

        const createdTransaction = await this.transactionsModel.create({
          sender_card_id: Math.random(),
          sender_full_name: targetVault.vault_title,
          receiver_card_id: currCard.card_id,
          receiver_card_number: currCard.card_number,
          receiver_full_name: full_name,
          transaction_amount: targetVault.vault_balance,
          transaction_description: `Розбиття банки: ${targetVault.vault_title}`,
          transaction_type: 'PIG-BANK',
        });

        await this.vaultModel.destroy({ where: { vault_id: dto.vault_id } });

        return createdTransaction;
      }
    } catch (error) {
      throw new ConflictException('Не твоє не чіпай!');
    }
  }

  async showUserVaults(user_id: number) {
    const vaults = await this.vaultModel.findAll({
      where: {
        [Op.or]: [{ user_id: user_id }, { contributors: user_id }],
      },
    });
    return vaults;
  }

  async changeVaultTitle(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findByPk(dto.vault_id);
    const isOwner = dto.user_id === targetVault.user_id;
    if (targetVault && isOwner) {
      const updatedVault = await this.vaultModel.update(
        { vault_title: dto.vault_title },
        { where: { vault_id: targetVault.vault_id } },
      );
      return updatedVault;
    } else throw new NotFoundException('Vault does not exist');
  }

  async getAllVaults() {
    return await this.vaultModel.findAll();
  }

  async addContributor(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findOne({
      where: { vault_id: dto.vault_id },
    }); // Знаходимо запис в базі даних за його ідентифікатором

    if (!targetVault) {
      throw new Error(`PigVault with id ${dto.vault_id} not found.`);
    }
    const isOwner = targetVault.user_id === dto.user_id;
    if (!isOwner) {
      const updatedVault = await this.vaultModel.update(
        { contributors: dto.user_id },
        { where: { vault_id: targetVault.vault_id } },
      );

      return updatedVault; // Повертаємо оновлений запис
    } else throw new ConflictException('Not allowed!');
  }

  async removeContributor(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findOne({
      where: { id: dto.vault_id },
    }); // Знаходимо запис в базі даних за його ідентифікатором

    if (!targetVault) {
      throw new Error(`PigVault with id ${dto.vault_id} not found.`);
    }

    const updatedVault = await this.vaultModel.update(
      { contributors: null },
      { where: { vault_id: dto.vault_id } },
    );

    return updatedVault;
  }

  async changeTargenSum(dto: createPigVaultDto) {
    const targetVault = await this.vaultModel.findByPk(dto.vault_id);
    const isOwner = dto.user_id === targetVault.user_id;
    if (targetVault && isOwner) {
      const updatedVault = await this.vaultModel.update(
        { target_sum: dto.target_sum },
        { where: { vault_id: targetVault.vault_id } },
      );
      return updatedVault;
    } else throw new NotFoundException('Vault does not exist');
  }
}
