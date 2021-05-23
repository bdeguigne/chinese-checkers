import { IsNotEmpty } from 'class-validator';

export class AddPlayerDto {
  @IsNotEmpty()
  playerId!: string;
}
