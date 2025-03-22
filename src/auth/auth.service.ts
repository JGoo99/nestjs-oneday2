import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from '../user/dto/send-email.dto';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { ConfirmEmailDto } from '../user/dto/confirm-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const generatedNumber = this.generateOTP();

    await this.cacheManager.set(sendEmailDto.email, generatedNumber);

    await this.emailService.sendEmail({
      to: sendEmailDto.email,
      subject: 'Elicelab Oneday Class - Goo',
      html: `<h1>Welcome to Elicelab</h1><br/><b>${generatedNumber}</b>`,
    });
  }

  generateOTP() {
    let otp = '';
    for (let i = 1; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto): Promise<boolean> {
    const emailCodeByRedis = await this.cacheManager.get(confirmEmailDto.email);
    if (emailCodeByRedis !== confirmEmailDto.code) {
      throw new BadRequestException('invalid code provided');
    }
    await this.cacheManager.del(confirmEmailDto.email);
    return true;
  }

  async generateAccessToken(userId: string): Promise<string> {
    const payload: any = { userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`,
    });
    return accessToken;
  }
}
