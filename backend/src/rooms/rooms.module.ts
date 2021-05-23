import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { DatabaseModule } from 'src/database/database.modules';
import { RoomsProviders } from './rooms.provider';
import { PlayersProviders } from 'src/players/players.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomsController],
  providers: [RoomsService, ...RoomsProviders, ...PlayersProviders],
})
export class RoomsModule {}
