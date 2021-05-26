import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { PlayersModule } from './players/players.module';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [RoomsModule, PlayersModule, EventsModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule /*implements NestModule */ {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: 'rooms', method: RequestMethod.GET });
  // }
}
