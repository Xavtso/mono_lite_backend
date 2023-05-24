import {  Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('/all')
  @ApiResponse({ status: 200, description: 'Retrieved all cards successfully' })
  getAll() {
    return this.cardsService.getAllCards();
  }

  @Get('/:id')
  @ApiResponse({ status: 200, description: 'Retrieved card successfully' })
  getUserCard(@Param('id') id: number) {
    return this.cardsService.getCardById(id);
  }
}
