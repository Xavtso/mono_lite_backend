import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PiggybankService } from './piggybank.service';
import { createPigVaultDto } from './dto/create-Pig-Vault.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PiggyBank } from './piggybank.model';

@ApiTags('Piggy Bank')
@Controller('piggybank')
export class PiggybankController {
  constructor(private pigService: PiggybankService) {}

  @ApiOperation({ summary: 'Get User Vaults' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user vaults',
    type: [PiggyBank],
  })
  @Get('/:id')
  showVaults(@Param('id') id: number) {
    return this.pigService.showUserVaults(id);
  }

  @ApiOperation({ summary: 'Get All Vaults' })
  @ApiResponse({ status: 200, description: 'Returns all vaults' })
  @Get('/all')
  getAll() {
    return this.pigService.getAllVaults();
  }

  @ApiOperation({ summary: 'Break Vault' })
  @ApiBody({ type: createPigVaultDto })
  @ApiResponse({ status: 200, description: 'Vault broken successfully' })
  @Post('/break')
  breakVault(@Body() dto: createPigVaultDto) {
    return this.pigService.breakJar(dto);
  }

  @ApiOperation({ summary: 'Deposit to Vault' })
  @ApiBody({ type: createPigVaultDto })
  @ApiResponse({ status: 200, description: 'Amount deposited successfully' })
  @Post('/deposit')
  depositToVault(@Body() dto: createPigVaultDto) {
    return this.pigService.depositToJar(dto);
  }

  @ApiOperation({ summary: 'Withdraw from Vault' })
  @ApiBody({ type: createPigVaultDto })
  @ApiResponse({ status: 200, description: 'Amount withdrawn successfully' })
  @Post('/withdraw')
  withdrawFromVault(@Body() dto: createPigVaultDto) {
    return this.pigService.withdrawFromJar(dto);
  }

  @ApiOperation({ summary: 'Change Vault Credenials' })
  @ApiBody({ type: createPigVaultDto })
  @ApiResponse({ status: 200, description: 'Vault sum changed successfully' })
  @Post('/credentials')
  changeTargetSum(@Body() dto: createPigVaultDto) {
    return this.pigService.changeJarCredentials(dto);
  }
}
