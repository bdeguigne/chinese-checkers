import * as mongoose from 'mongoose';

export const PlayersSchema = new mongoose.Schema({
  name: String,
});
