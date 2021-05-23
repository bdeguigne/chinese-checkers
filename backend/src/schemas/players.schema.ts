import * as mongoose from 'mongoose';

export const PlayersSchema = new mongoose.Schema(
  {
    name: String,
    avatar: {
      type: String,
      seed: String,
    },
  },
  {
    versionKey: false,
    typeKey: '$type',
  },
);
