import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'goo@naver.com' })
  email: string;
}
