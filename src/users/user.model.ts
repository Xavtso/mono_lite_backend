import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsToMany, Column, DataType, HasMany, Model, Table,AfterCreate } from "sequelize-typescript";
import { Card } from "src/cards/card.model";


interface UserCreationsAttrs{
    first_name: string,
    second_name: string,
    email: string
    password: string,

}



@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationsAttrs> {
    @ApiProperty({ example: '1', description: 'unique identificator' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    user_id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'User Email' })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @ApiProperty({ example: '2001406', description: "User's password" })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @ApiProperty({ example: 'Vitaliy', description: "User's first name" })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string;

    @ApiProperty({ example: 'Havrona', description: "User's second name" })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    second_name: string;
    
    @HasMany(() => Card, 'user_id')
    cards: Card[];
    static user_id: number;

    
}
