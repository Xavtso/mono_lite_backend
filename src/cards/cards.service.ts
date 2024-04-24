import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { User } from '../users/user.model';
import { CardBuilder } from './card.builder';
import { CardUtils } from './card.utils';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(User) private userModel: typeof User,
    private generator: CardUtils,
  ) {}

  async createCard(user_id: number) {
    const user = await this.userModel.findByPk(user_id);
    if (!user) {
      throw new NotFoundException('This User does not exist');
    }

    const cardNumber = await this.generator.generateUniqueCardNumber();
    const codeCVV = await this.generator.generateCVV();
    try {
      const card = new CardBuilder(user)
        .setCardNumber(cardNumber)
        .setCardCVV(codeCVV)
        .build();
      await card.save();
      await user.update({ card_number: cardNumber });
      return card;
    } catch (error) {
      throw new BadRequestException('Some error occured :(');
    }
  }

  async getAllCards() {
    const cards = await this.cardModel.findAll();
    return cards;
  }

  async getCardById(id: number) {
    const card = await this.cardModel.findByPk(id);
    return card;
  }
  async getCardByNumber(card_number: string) {
    const card = await this.cardModel.findOne({ where: { card_number } });

    return card;
  }
}
