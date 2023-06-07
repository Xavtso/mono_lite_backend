import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: createUserDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  login(@Body() userDto: createUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/signUp')
  @ApiBody({ type: createUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  signUp(@Body() userDto: createUserDto) {
    return this.authService.signUp(userDto);
  }
}
