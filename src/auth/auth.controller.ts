import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { RequestWithUser } from './interfaces/request-with-user';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { SendEmailDto } from '../user/dto/send-email.dto';
import { ConfirmEmailDto } from '../user/dto/confirm-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signupUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = await this.authService.generateAccessToken(user.id);
    return { user, accessToken };
    // await this.authService.validateUser();
  }

  @Post('/send/email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    await this.authService.emailVerify(sendEmailDto);
  }

  @Post('/confirm/email')
  async confirmEmail(
    @Body() verifyEmailDto: ConfirmEmailDto,
  ): Promise<boolean> {
    return await this.authService.confirmEmail(verifyEmailDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<User> {
    return req.user;
  }
}
