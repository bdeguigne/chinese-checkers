import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AvatarDto {
  @ApiProperty()
  type!: string;
  @ApiProperty()
  seed!: string;
}

export class CreatePlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  avatar!: AvatarDto;
}
