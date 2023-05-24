import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { createTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.model';



@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: createTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been created successfully.',
  })
  @Post('/new')
  createTransaction(@Body() dto: createTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }

  @ApiOperation({ summary: 'Simulate a deposit transaction' })
  @ApiBody({ type: createTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'The deposit transaction simulation was successful.',
  })
  @Post('/simulate/deposit')
  simulateDeposit(@Body() dto: createTransactionDto) {
    return this.transactionService.simulateDeposit(dto);
  }

  @ApiOperation({ summary: 'Simulate a withdrawal transaction' })
  @ApiBody({ type: createTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'The withdrawal transaction simulation was successful.',
  })
  @Post('/simulate/withdrawal')
  simulateWithdrawal(@Body() dto: createTransactionDto) {
    return this.transactionService.simulateWithdrawal(dto);
  }

  @ApiOperation({ summary: 'Get user transactions by ID' })
  @ApiParam({
    name: 'user_id',
    type: 'number',
    example: 1,
    description: 'The ID of the user.',
  })
  @ApiResponse({ status: 200, type: [Transaction] })
  @Get('/:user_id')
  getUserTransactions(@Param('user_id') userId: number) {
    return this.transactionService.getUsersTransactions(userId);
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, type: [Transaction] })
  @Get('/all')
  getAllTransactions() {
    return this.transactionService.getAllTransactions();
  }
}
