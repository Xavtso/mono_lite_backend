import { ApiProperty } from '@nestjs/swagger';


export class CreateCardDto {

  @ApiProperty({example: '1', description:'Card\'s owner identificator'})
    user_id: number;
    
   readonly card_number:string
}
