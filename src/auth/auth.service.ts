import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from '../user/dto/send-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async signupUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    const isPasswordMatched = await user.checkPassword(loginUserDto.password);
    if (!isPasswordMatched) {
      throw new HttpException(
        'password do not matched',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async emailVerify(sendEmailDto: SendEmailDto): Promise<void> {
    await this.emailService.sendEmail({
      to: sendEmailDto.email,
      subject: 'Elicelab Oneday Class - Goo',
      html: '<h1>Welcome to Elicelab</h1>',
    });
  }
}
