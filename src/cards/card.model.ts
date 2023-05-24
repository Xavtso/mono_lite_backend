import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'cards' })
export class Card extends Model<Card> {
  @ApiProperty({ example: '1', description: 'unique identificator' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  card_id: number;
  @Column({
    type: DataType.INTEGER,
    unique: false,
    primaryKey: true,
  })
  user_id: number;

  @ApiProperty({ example: '5375...1826', description: 'Card Number' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  card_number: string;

  @ApiProperty({ example: '2000', description: 'Card Balance' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  card_balance: number;

  @ApiProperty({ example: '111', description: 'Secret CVV code' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  card_CVV: string;

  @ApiProperty({ example: 'Vitaliy', description: 'Card Owner Name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 0,
  })
  owner_name: string;

  @ApiProperty({ example: 'Havrona', description: 'Card Owner Surname' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 0,
  })
  owner_surname: string;

  @ApiProperty({ example: 'false', description: 'Is card blocked?' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  blocked: boolean;

  @ApiProperty({
    example: 'Overdrafting',
    description: 'Why card was blocked',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  blockReason: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
  })
    
// I left this piece of code to avoid recreating the table because I would have lost all the users
// ///////////////////////////////////////////////////////////////////
  @BeforeCreate({})
  static async generateCardNumber(card: Card) {
    // const cardNumber = await generateUniqueCardNumber();
    //This piece of code lefted for 
  }
//////////////////////////////////////////////////////////
  
  @BelongsTo(() => User, 'user_id')
  user: User;

 
}

