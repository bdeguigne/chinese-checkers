import { UseFilters } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilter } from 'src/core/ws-exception.filters';
import { GameDto, LobbyDto } from './dto/join-lobby.dto';
import { GameService } from './game.service';

export enum lobbyEvents {
  joinLobby = 'join-lobby',
  play = 'play',
}

export enum gameEvents {
  connected = 'connected',
  start = 'start',
  notReady = 'not-ready',
  moveFinished = 'move-finished',
  updateBoard = 'update-board',
}

@WebSocketGateway(8080)
@UseFilters(new AllExceptionsFilter())
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('lobby')
  joinLobby(@MessageBody() data: LobbyDto, @ConnectedSocket() client: Socket) {
    if (data.event === lobbyEvents.joinLobby) {
      client.join(data.roomId);
      this.server.to(data.roomId).emit('lobby', {
        event: lobbyEvents.joinLobby,
      });
    }
    if (data.event === lobbyEvents.play) {
      this.server.to(data.roomId).emit('lobby', {
        event: lobbyEvents.play,
      });
    }
  }

  @SubscribeMessage('game')
  async game(@MessageBody() data: GameDto) {
    console.log('Receive game message from client', data);
    if (!data.event || !data.roomId) {
      throw new WsException('Incorrect data');
    }

    if (data.event === gameEvents.connected) {
      if (!data.playerId) {
        throw new WsException('Incorrect data');
      }
      return this.gameService.connectPlayer(data).then((response) => {
        this.server.to(data.roomId.toString()).emit('game', response);
      });
    }
    if (data.event === gameEvents.moveFinished) {
      if (!data.board) {
        throw new WsException('Incorrect data');
      }
      // TODO Verifier le move
      this.server.to(data.roomId.toString()).emit('game', {
        event: gameEvents.updateBoard,
        data: {
          roomId: data.roomId,
          board: data.board,
        },
      });
    }
  }
}
