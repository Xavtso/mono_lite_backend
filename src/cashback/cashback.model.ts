import { ApiProperty } from '@nestjs/swagger';
import { Model, Column, DataType, Table } from 'sequelize-typescript';

interface CashBackCreateAttr {
  card_id: number;
  cashback_balance: number;
}

@Table({ tableName: 'CashBack' })
export class CashBack extends Model<CashBack, CashBackCreateAttr> {
  @ApiProperty({ example: 1, description: 'Cashback ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  cashback_id: number;

  //   @ForeignKey(() => Card)
  @ApiProperty({ example: 1, description: 'Card ID' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  card_id: number;

  @ApiProperty({ example: 100, description: 'Cashback balance' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  cashback_balance: number;
}
