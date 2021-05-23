import { Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  avatar: Avatar;
}
