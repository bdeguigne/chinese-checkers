export class LobbyDto {
  event!: string;
  roomId!: number;
  playerId!: number;
}

export class GameDto {
  event!: string;
  roomId!: number;
  playerId!: number;
  board!: number[][][];
  playerName!: string;
}
