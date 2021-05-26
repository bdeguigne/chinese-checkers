import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.modules';
import { PlayersProviders } from 'src/players/players.provider';
import { RoomsProviders } from 'src/rooms/rooms.provider';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    RoomsService,
    GameGateway,
    GameService,
    ...RoomsProviders,
    ...PlayersProviders,
  ],
})
export class GameModule {}
