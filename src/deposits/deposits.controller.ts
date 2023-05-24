import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { createDepositDto } from './dto/createDeposit.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { Deposit } from './deposit.model';

@ApiTags('Deposits')
@Controller('deposits')
export class DepositsController {
  constructor(private depositsService: DepositsService) {}

  @ApiOperation({ summary: 'Create a new deposit' })
  @ApiBody({ type: createDepositDto })
  @ApiResponse({
    status: 201,
    description: 'The deposit has been successfully created.',
    type: Deposit,
  })
  @Post()
  async createDeposit(@Body() dto: createDepositDto) {
    return await this.depositsService.createDeposit(dto);
  }

  @ApiOperation({ summary: 'Update the amount of a deposit' })
  @ApiBody({ type: createDepositDto })
  @ApiResponse({
    status: 200,
    description: 'The amount of the deposit has been successfully updated.',
  })
  @Post('/update')
  async updateAmountOfDeposit(@Body() dto: createDepositDto) {
    return await this.depositsService.updateAmountOfDeposit(dto);
  }

  @ApiOperation({ summary: 'Show user deposits' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user deposits.',
    type: [Deposit],
  })
  @Get('/:id')
  async showUserVaults(@Param('id') id: number) {
    return await this.depositsService.showUserVaults(id);
  }

  @ApiOperation({ summary: 'Show all deposits' })
  @ApiResponse({
    status: 200,
    description: 'Returns all deposits.',
    type: [Deposit],
  })
  @Get()
  async showAll() {
    return await this.depositsService.showAllVaults();
  }

  @ApiOperation({ summary: 'Destroy a deposit' })
  @ApiBody({ type: createDepositDto })
  @ApiResponse({
    status: 200,
    description: 'The deposit has been successfully destroyed.',
  })
  @Post('/destroy')
  async destroyVault(@Body() dto: createDepositDto) {
    return await this.depositsService.destroyVault(dto);
  }
}
