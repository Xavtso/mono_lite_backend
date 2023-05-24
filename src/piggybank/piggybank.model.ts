import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

interface PiggyBankCreationAttrs {
  user_id: number;
  target_sum: number;
  balance: number;
  vault_title: string;
  contributors: number;
}

@Table({ tableName: 'pigVault' })
export class PiggyBank extends Model<PiggyBank, PiggyBankCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Vault ID' })
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  vault_id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ApiProperty({ example: 'My Piggy Bank', description: 'Vault Title' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  vault_title: string;

  @ApiProperty({ example: 1000, description: 'Target Sum' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  target_sum: number;

  @ApiProperty({ example: 500, description: 'Vault Balance' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  vault_balance: number;

  @ApiProperty({ example: 5, description: 'Contributors' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  contributors: number;
}
