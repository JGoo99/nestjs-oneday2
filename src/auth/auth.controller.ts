import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signupUser(createUserDto);
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.signInUser(loginUserDto);
  }
}
