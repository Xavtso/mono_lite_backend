import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { createTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionUtils {
  constructor(private cardService: CardsService) {}

  async getReceiverCard(dto: createTransactionDto) {
    const receiverCard = await this.cardService.getCardByNumber(
      dto.receiver_card_number,
    );

    if (!receiverCard) {
      throw new NotFoundException(
        'Не шукай вітру в полі! -- Користувача з такою 💳 не знайдено.',
      );
    }

    if (receiverCard.blocked) {
      throw new ConflictException(
        'Стоїть в кутку - наказаний(а)! -- Цю карту заблоковано!',
      );
    }

    return receiverCard;
  }
}
