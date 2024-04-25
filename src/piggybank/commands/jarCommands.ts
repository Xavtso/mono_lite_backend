import { PiggyBank } from '../piggybank.model';
import { createPigVaultDto } from '../dto/create-Pig-Vault.dto';
import { TransactionRepository } from 'src/transactions/transactionRepository';
import { BadRequestException } from '@nestjs/common';
import { JarUtils } from '../utils';
import { CardUtils } from '../../cards/card.utils';

interface Command {
  execute(): Promise<string>;
}

// Команда для створення копилки
export class CreateVaultCommand implements Command {
  constructor(
    private vaultModel: typeof PiggyBank,
    private dto: createPigVaultDto,
  ) {}

  async execute(): Promise<string> {
    await this.vaultModel.create({
      user_id: this.dto.user_id,
      target_sum: this.dto.target_sum,
      vault_title: this.dto.vault_title,
    });
    return 'Jar created!';
  }
}

// Команда для внесення коштів до копилки
export class DepositToJarCommand implements Command {
  constructor(
    private transactionRepository: TransactionRepository,
    private cardUtils: CardUtils,
    private dto: createPigVaultDto,
    private jarUtils: JarUtils,
  ) {}

  async execute(): Promise<string> {
    const { vault_id, user_id, amount } = this.dto;

    const jar = await this.jarUtils.getTargetJar(vault_id);
    const currCard = await this.cardUtils.getUserCard(user_id);
    const isEnough = amount <= currCard.card_balance;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;
    if (!isEnough)
      throw new BadRequestException('Недостатньо грошей на балансі!');

    try {
      await this.cardUtils.withdrawBalanceFromCard(currCard, amount);

      await this.jarUtils.addToJar(jar, amount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.round(Math.random()),
        receiver_card_number: ' ',
        receiver_full_name: jar.vault_title,
        transaction_amount: this.dto.amount,
        transaction_description: `Поповнення моно-банки: ${jar.vault_title}`,
        transaction_type: 'PIG-BANK',
      });
      return 'Operation successful';
    } catch (error) {
      throw new Error('Some error occured');
    }
  }
}

export class withdrawCommand implements Command {
  constructor(
    private dto: createPigVaultDto,
    private jarUtils: JarUtils,
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<string> {
    const { vault_id, user_id, amount } = this.dto;
    const jar = await this.jarUtils.getTargetJar(vault_id);
    const currCard = await this.cardUtils.getUserCard(user_id);
    const isEnough = amount <= jar.vault_balance;
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;

    if (!isEnough) {
      throw new BadRequestException('Недостатньо грошей у банці! ');
    }

    try {
      await this.cardUtils.addBalanceToCard(currCard, amount);
      await this.jarUtils.withdrawFromJar(jar, amount);

      await this.transactionRepository.createTransactionRecord({
        sender_card_id: currCard.card_id,
        sender_full_name: full_name,
        receiver_card_id: Math.round(Math.random()),
        receiver_card_number: ' ',
        receiver_full_name: jar.vault_title,
        transaction_amount: amount,
        transaction_description: `Зняття частини з банки: ${jar.vault_title}`,
        transaction_type: 'PIG-BANK',
      });
      return 'Operation Successful!';
    } catch (error) {
      throw new Error('Some error occured!');
    }
  }
}

export class breakJarCommand implements Command {
  constructor(
    private dto: createPigVaultDto,
    private jarUtils: JarUtils,
    private cardUtils: CardUtils,
    private transactionRepository: TransactionRepository,
  ) {}
  async execute(): Promise<string> {
    const { vault_id, user_id } = this.dto;

    const jar = await this.jarUtils.getTargetJar(vault_id);
    const currCard = await this.cardUtils.getUserCard(user_id);
    const full_name = currCard.owner_name + ' ' + currCard.owner_surname;
    try {
      await this.cardUtils.addBalanceToCard(currCard, jar.vault_balance);

      const createdTransaction =
        await this.transactionRepository.createTransactionRecord({
          sender_card_id: Math.round(Math.random()),
          sender_full_name: jar.vault_title,
          receiver_card_id: currCard.card_id,
          receiver_card_number: currCard.card_number,
          receiver_full_name: full_name,
          transaction_amount: jar.vault_balance,
          transaction_description: `Розбиття банки: ${jar.vault_title}`,
          transaction_type: 'PIG-BANK',
        });

      await this.jarUtils.breakJar(jar);

      return 'Jar successfully broken!';
    } catch (error) {
      throw new Error('Some error occured');
    }
  }
}
