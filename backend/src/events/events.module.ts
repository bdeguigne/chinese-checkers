import { Module, CacheModule } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.modules';
import { EventsGateway } from './events.gateway';
import { RoomsService } from '../rooms/rooms.service';
import { RoomsProviders } from 'src/rooms/rooms.provider';
import { PlayersProviders } from 'src/players/players.provider';
import { GameService } from 'src/game/game.service';
import { PlayersService } from 'src/players/players.service';

@Module({
  imports: [CacheModule.register(), DatabaseModule],
  providers: [
    EventsGateway,
    GameService,
    RoomsService,
    PlayersService,
    ...RoomsProviders,
    ...PlayersProviders,
  ],
})
export class EventsModule {}
