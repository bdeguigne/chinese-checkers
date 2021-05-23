import { Document } from 'mongoose';
import { Player } from 'src/players/interface/player.interface';

export interface Room extends Document {
  playersCount: number;
  players: Player[];
}
