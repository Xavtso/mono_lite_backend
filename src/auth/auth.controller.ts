import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    return await this.authService.googleLogin(req);
    // Redirect or send token as response
    // res.redirect(`YOUR_FRONTEND_URL?token=${token.token}`);
  }
}
