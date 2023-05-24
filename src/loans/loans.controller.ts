import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { createLoanDto } from './dto/createLoan.dto';
import { Loan } from './loans.model';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private loansServices: LoansService) {}

  @ApiOperation({ summary: 'Get Loan by ID' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({
    status: 200,
    description: 'Loan details',
    type: [Loan],
  })
  @Get('/:id')
  showLoan(@Param('id') id: number) {
    return this.loansServices.showLoanEntity(id);
  }

  @ApiOperation({ summary: 'Create a new Loan' })
  @ApiBody({ type: createLoanDto, description: 'Loan details' })
  @ApiResponse({
    status: 201,
    description: 'Loan created',
    type: createLoanDto,
  })
  @Post('/new')
  createLoan(@Body() dto: createLoanDto) {
    return this.loansServices.createLoan(dto);
  }

  @ApiOperation({ summary: 'Pay part of a Loan' })
  @ApiBody({ type: createLoanDto, description: 'Loan details' })
  @ApiResponse({ status: 200, description: 'Loan payment successful' })
  @Post('/pay/part')
  payPartOfLoan(@Body() dto: createLoanDto) {
    return this.loansServices.payPartOfLoan(dto);
  }

  @ApiOperation({ summary: 'Pay full Loan amount' })
  @ApiBody({ type: createLoanDto, description: 'Loan details' })
  @ApiResponse({ status: 200, description: 'Loan payment successful' })
  @Post('/pay/full')
  payFullLoan(@Body() dto: createLoanDto) {
    return this.loansServices.payFullLoan(dto);
  }
}
