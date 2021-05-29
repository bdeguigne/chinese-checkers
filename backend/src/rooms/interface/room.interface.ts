import { Document } from 'mongoose';
import { Player } from 'src/players/interface/player.interface';

export type RoomPlayerInfo = {
  info: Player;
  playerIndex: number;
};

export interface Room extends Document {
  playersCount: number;
  players: RoomPlayerInfo[];
  connectedPlayers: number[];
  board: number[][][];
}
