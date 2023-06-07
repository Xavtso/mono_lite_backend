import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { createUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}


  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, type: [User] })
  //  @UseGuards(JwtAuthGuard)  //Will be available in prod
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({ status: 200, type: [User] })
  @Get(':id')
  async getUser(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return user;
  }

  @Post('/delete')
  async deleteUser(@Body() dto: createUserDto) {
    return await this.usersService.deleteUser(dto);
  }
}
