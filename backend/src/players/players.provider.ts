import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, PLAYER_MODEL } from 'src/constants';
import { PlayersSchema } from '../schemas/players.schema';

export const PlayersProviders = [
  {
    provide: PLAYER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Player', PlayersSchema),
    inject: [DATABASE_CONNECTION],
  },
];
