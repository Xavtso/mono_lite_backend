import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

interface CurrencyCreationAttrs {
  currency_id: number;
  date: number;
  rateSell: number;
  rateBuy: number;
}

@Table({ tableName: 'currency' })
export class Currency extends Model<Currency, CurrencyCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  currency_id: number;

  @ApiProperty({ example: 1679483600, description: 'Last updated date' })
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  date: number;

  @ApiProperty({ example: 36.6, description: 'Sell currency rate' })
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  rateSell: number;

  @ApiProperty({ example: 36.6, description: 'Buy currency rate' })
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  rateBuy: number;
}
