import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StoreBoardDto {
  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  board!: number[][][];
}
