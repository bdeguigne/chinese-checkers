import { Module, CacheModule } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.modules';
import { PlayersProviders } from 'src/players/players.provider';
import { PlayersService } from 'src/players/players.service';
import { RoomsProviders } from 'src/rooms/rooms.provider';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [DatabaseModule, CacheModule.register()],
  providers: [
    RoomsService,
    PlayersService,
    GameGateway,
    GameService,
    ...RoomsProviders,
    ...PlayersProviders,
  ],
})
export class GameModule {}
