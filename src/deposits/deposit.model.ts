import { Table, Column, Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';

interface DepositCreationAttrs {
  user_id: number;
  amount: number;
  interest_rate: number;
  term: number;
  status: string;
  monthly_payment: number;
  end_date: Date;
}

@Table({ tableName: 'deposits' })
export class Deposit extends Model<Deposit, DepositCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Deposit ID' })
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ApiProperty({ example: 1000.0, description: 'Deposit amount' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  amount: number;

  @ApiProperty({ example: 5.5, description: 'Interest rate' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  interest_rate: number;

  @ApiProperty({ example: 12, description: 'Deposit term in months' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  term: number;

  @ApiProperty({ example: 150.0, description: 'Monthly payment' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  monthly_payment: number;

  @ApiProperty({ example: '2022-01-01', description: 'Deposit start date' })
  @Column({
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: new Date(),
  })
  start_date: Date;

  @ApiProperty({ example: '2022-02-01', description: 'Deposit end date' })
  @Column({
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: function () {
      const now = new Date();
      const futureDate = new Date(now.setMonth(now.getMonth() + 1));
      return futureDate;
    },
  })
  end_date: Date;

  @ApiProperty({ example: 'active', description: 'Deposit status' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  })
  status: string;
}
