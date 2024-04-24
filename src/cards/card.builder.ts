import { User } from "src/users/user.model";
import { Card } from "./card.model";

export class CardBuilder {
  private user: User;
  private cardNumber: string;
  private cardCVV: string;

  constructor(user: User) {
    this.user = user;
  }

  setCardNumber(cardNumber: string): CardBuilder {
    this.cardNumber = cardNumber;
    return this;
  }

  setCardCVV(cardCVV: string): CardBuilder {
    this.cardCVV = cardCVV;
    return this;
  }

  build(): Card {
    return new Card({
      user_id: this.user.id,
      owner_name: this.user.first_name,
      owner_surname: this.user.second_name,
      card_number: this.cardNumber,
      card_balance: 0,
      card_CVV: this.cardCVV,
      blocked: false,
      blockReason: '',
    });
  }
}
