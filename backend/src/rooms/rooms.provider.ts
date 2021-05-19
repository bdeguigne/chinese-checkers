import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, ROOM_MODEL } from 'src/constants';
import { RoomSchema } from '../schemas/rooms.schema';

export const RoomsProviders = [
  {
    provide: ROOM_MODEL,
    useFactory: (connection: Connection) => connection.model('Room', RoomSchema),
    inject: [DATABASE_CONNECTION],
  },
];
