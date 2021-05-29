import * as mongoose from 'mongoose';

export const PlayersSchema = new mongoose.Schema(
  {
    name: String,
    avatar: {
      type: String,
      seed: String,
    },
    gameId: String,
    win: {
      $type: Number,
      default: 0,
    },
    lose: {
      $type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    typeKey: '$type',
  },
);
