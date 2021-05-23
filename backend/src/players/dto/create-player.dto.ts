import { IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  avatar!: {
    type: string;
    seed: string;
  };
}
