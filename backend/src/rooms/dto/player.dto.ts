import { IsNotEmpty } from 'class-validator';

export class AddPlayerDto {
  @IsNotEmpty()
  playerIndex!: number;
}

export class ConnectPlayerDto {
  @IsNotEmpty()
  playerIndex!: number;
}
