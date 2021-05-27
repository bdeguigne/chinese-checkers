import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { RoomsService } from '../rooms/rooms.service';
import { gameEvents, lobbyEvents } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';
import { PlayersService } from 'src/players/players.service';

@Injectable()
@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly playersService: PlayersService,
    private readonly roomsService: RoomsService,
    private readonly gameService: GameService,
  ) {}
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}, ${args}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    const player = await this.cacheManager.get<PlayerSocket>(
      `player-${client.id}`,
    );

    if (player) {
      try {
        const gameId = await this.playersService.isPlayerIsInGame(
          player.playerId,
        );
        console.log('IS PLAYER IS IN GAME ?', gameId);
        if (gameId) {
          const socketResponse = await this.gameService.disconnectPlayer(
            player.roomId,
            player.playerId,
          );
          console.log('DISCONNECT', socketResponse);
          this.server.to(player.roomId.toString()).emit('game', {
            event: gameEvents.notReady,
          });
        } else {
          await this.roomsService.removePlayer(player.roomId, player.playerId);
          this.server.to(player.roomId.toString()).emit('lobby', {
            event: lobbyEvents.joinLobby,
          });
        }
        //TODO Gerer la suppression de la room uniquement si il n'y pas de joueurs connecté;
      } catch (e) {
        console.log('In handle disconnect error', e.message);
      }
      console.log('PLAYER IN CACHE ', player);
    }
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   console.log(data);
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }
}
