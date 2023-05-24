import {
  Model,
  Column,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Card } from '../cards/card.model';
import { DataTypes } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';



interface TransactionCreateAttrs {
  sender_card_id: number;
  sender_full_name: string;
  receiver_card_id: number;
  receiver_card_number: string;
  receiver_full_name: string;
  transaction_amount: number;
  transaction_description: string;
  transaction_type: string;
}

@Table({ tableName: 'Transaction' })
export class Transaction extends Model<Transaction, TransactionCreateAttrs> {
  @ApiProperty({ example: 1, description: 'Transaction ID' })
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  transaction_id: number;

  // @ForeignKey(() => Card)
  @ApiProperty({ example: 1, description: 'Sender Card ID' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  sender_card_id: number;

  @ApiProperty({ example: 'John Doe', description: 'Sender Full Name' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  sender_full_name: string;

  @ForeignKey(() => Card)
  @ApiProperty({ example: 2, description: 'Receiver Card ID' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  receiver_card_id: number;

  @ApiProperty({
    example: '1234567890123456',
    description: 'Receiver Card Number',
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  receiver_card_number: string;

  @ApiProperty({ example: 'Jane Smith', description: 'Receiver Full Name' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  receiver_full_name: string;

  @ApiProperty({
    example: 'Payment for services',
    description: 'Transaction Description',
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  })
  transaction_description: string;

  @ApiProperty({ example: 100, description: 'Transaction Amount' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  transaction_amount: number;

  @ApiProperty({ example: 'deposit', description: 'Transaction Type' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  transaction_type: string;

  @ApiProperty({
    example: '2023-05-16T12:00:00.000Z',
    description: 'Transaction Date',
  })
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  transaction_date: Date;

  @ApiProperty({ example: 'SUCCESSFUL', description: 'Transaction Status' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'success',
  })
  transaction_status: string;
}
