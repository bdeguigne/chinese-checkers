import { Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  avatar: Avatar;
  gameId: number;
  win: number;
  loose: number;
}
