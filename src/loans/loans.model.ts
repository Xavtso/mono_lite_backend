import { Table, Column, Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';

interface LoanCreationAttrs {
  borrower_id: number;
  amount: number;
  interest_rate: number;
  term: number;
  status: string;
  amount_to_pay: number;
  monthly_payment: number;
  end_date: Date;
}

@Table({ tableName: 'loans' })
export class Loan extends Model<Loan, LoanCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Loan ID' })
  @Column({
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Borrower ID' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  borrower_id: number;

  @ApiProperty({ example: 10000.0, description: 'Loan amount' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  amount: number;

  @ApiProperty({ example: 10000.0, description: 'Amount to pay' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10000.0,
  })
  amount_to_pay: number;

  @ApiProperty({ example: 5.5, description: 'Interest rate' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  interest_rate: number;

  @ApiProperty({ example: 12, description: 'Loan term in months' })
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  term: number;

  @ApiProperty({ example: 1500.0, description: 'Monthly payment' })
  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1500.0,
  })
  monthly_payment: number;

  @ApiProperty({ example: '2022-01-01', description: 'Loan start date' })
  @Column({
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: new Date(),
  })
  start_date: Date;

  @ApiProperty({ example: '2023-01-01', description: 'Loan end date' })
  @Column({
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: () => {
      const now = new Date();
      const futureDate = new Date(now.setFullYear(now.getFullYear() + 1));
      return futureDate;
    },
  })
  end_date: Date;

  @ApiProperty({ example: 'success', description: 'Loan status' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'success',
  })
  status: string;
}
