import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { User } from '../users/user.model';

@Injectable()
export class CardsService {
  
  constructor(
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async getCardById(id: number) {
    console.log(id);
    const card = await this.cardModel.findByPk(id);
    return card;
  }
  async createCard(user_id: number) {
    const user = await this.userModel.findByPk(user_id);
    if (!user) {
      throw new NotFoundException('This User does not exist');
    }

    const cardNumber = await this.generateUniqueCardNumber();
    const codeCVV = await this.generateCVV();
    const card = await this.cardModel.create({
      user_id: user_id,
      owner_name: user.first_name,
      owner_surname: user.second_name,
      card_number: cardNumber,
      card_balance: 0,
      card_CVV: codeCVV,
      blocked: false,
      blockReason: '',
    });

    await user.update({ card_number: cardNumber });

    return card;
  }

  async getAllCards() {
    const cards = await this.cardModel.findAll();
    return cards;
  }

  async getCardsByUserId(user_id: number) {
    const card = await this.cardModel.findOne({ where: { user_id } });

    return card;
  }

  async getCardByNumber(card_number: string) {
    const card = await this.cardModel.findOne({ where: { card_number } });

    return card;
  }

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
    const BIN = '5375'; // Bank Identification Number
    const randomNumber = Math.floor(Math.random() * 999999999999); // 14-digit random number
    const cardNumber =
      BIN + randomNumber.toString().padStart(14 - BIN.length, '0'); // 16-digit card number
    return cardNumber;
  }

  async generateCVV() {
    const firstNumber = Math.floor(Math.random() * 9) + '';
    const secondNumber = Math.floor(Math.random() * 9) + '';
    const thirdNumber = Math.floor(Math.random() * 9) + '';
    const CVV = firstNumber + secondNumber + thirdNumber;
    return CVV;
  }
}
