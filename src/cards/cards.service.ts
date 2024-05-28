import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { CardUtils } from './card.utils';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

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
      const card = await this.createAndSaveCardForUser(user);
      await this.updateUserWithCardNumber(user, card.card_number);
      return card;
    } catch (error) {
      this.handleCreationError(error);
    }
  }

  private async createAndSaveCardForUser(user: User) {
    const creationData = await this.cardUtils.prepareCreationData(user);
    const card = await this.cardModel.create({ ...creationData });
    await card.save();
    return card;
  }

  private async updateUserWithCardNumber(user: User, card_number: string) {
    await user.update({ card_number: card_number });
  }

  private handleCreationError(error: any) {
    throw new BadRequestException('Some error occurred, Card not created :(');
  }

  async getAllCards() {
    return await this.cardModel.findAll();
  }

  async getCardById(id: number) {
    return await this.cardModel.findByPk(id);
  }

  async getCardByNumber(card_number: string) {
    return await this.cardModel.findOne({ where: { card_number } });
  }
}
