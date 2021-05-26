import { Schema } from 'mongoose';

export const RoomSchema = new Schema(
  {
    playersCount: {
      type: Number,
      default: 0,
    },
    players: [
      {
        info: Object,
        playerIndex: Number,
      },
    ],
    creatorName: {
      type: String,
      default: '',
    },
    connectedPlayers: [String],
  },
  {
    versionKey: false,
  },
);
