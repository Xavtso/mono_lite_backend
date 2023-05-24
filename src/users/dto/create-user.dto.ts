import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class createUserDto {

    @ApiProperty({example: 'Vitaliy', description: 'first name'})
    readonly first_name: string;
    @ApiProperty({example: 'Havrona', description: 'second name'})
    readonly second_name: string;
    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    readonly email: string;
    @ApiProperty({example: '20041406', description: 'password'})
    readonly password: string;

    readonly id: number;

    readonly imageURL: string; 
}