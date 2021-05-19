import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PlayersProviders } from './players.provider';
import { DatabaseModule } from 'src/database/database.modules';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayersController],
  providers: [PlayersService, ...PlayersProviders],
})
export class PlayersModule {}
