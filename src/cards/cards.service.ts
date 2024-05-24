import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { CardUtils } from './card.utils';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card) private cardModel: typeof Card,
    private userService: UsersService,
    private cardUtils: CardUtils,
  ) {}

  async createCard(user_id: number) {
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      throw new NotFoundException('This User does not exist');
    }

    try {
      const creationData = await this.cardUtils.prepareCreationData(user);
      const card = await this.cardModel.create({ ...creationData });
      await card.save();
      await user.update({ card_number: card.card_number });
      return card;
    } catch (error) {
      throw new BadRequestException('Some error occured, Card not created :(');
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
