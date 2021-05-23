import { Schema } from 'mongoose';

export const RoomSchema = new Schema(
  {
    playersCount: {
      type: Number,
      default: 0,
    },
    players: Array,
    creatorName: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
  },
);
