export class LobbyDto {
  event!: string;
  roomId!: string;
}

export class GameDto {
  event!: string;
  roomId!: number;
  playerId!: number;
  board!: number[][][];
}
