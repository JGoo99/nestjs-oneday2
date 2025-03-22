import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @IsEmail()
  @ApiProperty({ example: 'goo@naver.com' })
  email: string;
}
