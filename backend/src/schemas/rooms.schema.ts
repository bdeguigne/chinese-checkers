import { Schema } from 'mongoose';

export const RoomSchema = new Schema(
  {
    playersCount: {
      type: Number,
      default: 0,
    },
    players: Array,
    // {
    //   info:
    //   playerIndex: Number,
    // },

    creatorName: {
      type: String,
      default: '',
    },
    connectedPlayers: [String],
    board: Array,
  },
  {
    versionKey: false,
  },
);
