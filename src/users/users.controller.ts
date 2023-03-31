import { Controller, Post,Get, Body, Param, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiResponse,ApiOperation } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { Card } from 'src/cards/card.model';
import { CardsService } from 'src/cards/cards.service';
import { createUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/logIn-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    readonly cardService: CardsService,
  ) {}
// Create or get users
  @ApiOperation({ summary: 'Create User and Card' })
  @ApiResponse({ status: 200, type: User  })
  @Post()
  async create(@Body() userDto: createUserDto) {
    const newUser = await this.usersService.createUser(userDto);

    // Create a new card for the user
    await this.cardService.createCard(newUser.user_id);

    return newUser;
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

    
  @ApiOperation({ summary: 'Get User bu ID' })
  @ApiResponse({ status: 200, type: [User] })
  @Get(':user_id')
  async getCardById(@Param('user_id') user_id: number) {
    const user = await this.usersService.getUserById(user_id);
    return user;
  }
  // //////////////////////////



  // Authorize and Validate Users
  @Post('/login')
  async loginUser(@Body() dto:LogInUserDto) {
    const user = await this.usersService.getUserbyEmail(dto)
    return user
  }
}

