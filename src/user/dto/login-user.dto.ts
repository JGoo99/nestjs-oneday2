import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'goo@naver.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123' })
  password: string;
}
