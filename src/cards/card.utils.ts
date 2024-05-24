import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { User } from '../users/user.model';

@Injectable()
export class CardUtils {
  constructor(@InjectModel(Card) private cardModel: typeof Card) {}

  async generateUniqueCardNumber(): Promise<string> {
    const MAX_ATTEMPTS = 20;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      const cardNumber = await this.generateRandomCardNumber();
      const card = await this.cardModel.findOne({
        where: { card_number: cardNumber },
      });
      if (!card) {
        return cardNumber;
      }
      attempt++;
    }

    throw new Error('Could not generate unique card number');
  }

  async generateRandomCardNumber() {
    const BIN = '5375';
    const randomNumber = Math.floor(Math.random() * 999999999999);
    const cardNumber =
      BIN + randomNumber.toString().padStart(14 - BIN.length, '0');
    return cardNumber;
  }

  async generateCVV() {
    const firstNumber = Math.floor(Math.random() * 9) + '';
    const secondNumber = Math.floor(Math.random() * 9) + '';
    const thirdNumber = Math.floor(Math.random() * 9) + '';
    const CVV = firstNumber + secondNumber + thirdNumber;
    return CVV;
  }

  async getUserCard(user_id: number) {
    const card = await this.cardModel.findOne({ where: { user_id } });

    return card;
  }

  async prepareCreationData(user: User) {
    const creationData = {
      user_id: user.user_id,
      card_number: await this.generateUniqueCardNumber(),
      card_CVV: await this.generateCVV(),
      owner_name: user.first_name,
      owner_surname: user.second_name,
    };
    return creationData;
  }

  async addBalanceToCard(card: Card, amount: number) {
    await card.update({ card_balance: card.card_balance + amount });
  }
  async withdrawBalanceFromCard(card: Card, amount: number) {
    await card.update({ card_balance: card.card_balance - amount });
  }
}
