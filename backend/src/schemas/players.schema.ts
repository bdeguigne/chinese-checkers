import * as mongoose from 'mongoose';

export const PlayersSchema = new mongoose.Schema(
  {
    name: String,
    avatar: {
      type: String,
      seed: String,
    },
    gameId: String,
  },
  {
    versionKey: false,
    typeKey: '$type',
  },
);
