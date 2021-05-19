import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, PLAYER_MODEL } from 'src/constants';
import { RoomSchema } from '../schemas/rooms.schema';

export const PlayersProviders = [
  {
    provide: PLAYER_MODEL,
    useFactory: (connection: Connection) => connection.model('Player', RoomSchema),
    inject: [DATABASE_CONNECTION],
  },
];
