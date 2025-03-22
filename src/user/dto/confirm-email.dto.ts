import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @IsEmail()
  @ApiProperty({ example: 'goo@naver.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345' })
  code: string;
}
