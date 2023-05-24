import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

interface userCurrencyCreationAttrs {
  user_id: number;
  eur_balance: number;
  usd_balance: number;
}

@Table({ tableName: 'UserCurrency' })
export class UserCurrency extends Model<
  UserCurrency,
  userCurrencyCreationAttrs
> {
  @ApiProperty({ example: '1', description: 'unique identificator' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  user_id: number;

  @ApiProperty({
    example: '65464124054(Unix time)',
    description: 'last updated date',
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  eur_balance: number;

  @ApiProperty({ example: '36.6', description: 'Sell currency rate' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  usd_balance: number;

  @ApiProperty({ example: '36.6', description: 'Buy currency rate' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  rateBuy: number;

  @BelongsTo(() => User, 'user_id')
  user: User;
}
