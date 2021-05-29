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
  leaveLobby = 'leave-lobby',
}

export enum gameEvents {
  connected = 'connected',
  start = 'start',
  notReady = 'not-ready',
  moveFinished = 'move-finished',
  updateBoard = 'update-board',
  nextPlayer = 'next-player',
  playerWins = 'player-wins',
}

@WebSocketGateway()
@UseFilters(new AllExceptionsFilter())
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('lobby')
  async joinLobby(
    @MessageBody() data: LobbyDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (data.event === lobbyEvents.joinLobby) {
      await this.gameService.assignPlayerWithSocketId(
        data.playerId,
        data.roomId,
        client.id,
      );
      console.log('joinLobby', data.playerId);
      client.join(data.roomId.toString());
      this.server.to(data.roomId.toString()).emit('lobby', {
        event: lobbyEvents.joinLobby,
      });
    }
    if (data.event === lobbyEvents.play) {
      const room = await this.gameService.storeRoomInCache(data.roomId);
      if (room) {
        await this.gameService.storeBoardInCache(room._id, room.playersCount);
        this.server.to(data.roomId.toString()).emit('lobby', {
          event: lobbyEvents.play,
        });
      }
    }
    if (data.event === lobbyEvents.leaveLobby) {
      console.log('LEAVE LOBBY');
      this.server.to(data.roomId.toString()).emit('lobby', {
        event: lobbyEvents.joinLobby,
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
      await this.gameService.updateBoard(data.board, data.roomId);
      this.server.to(data.roomId.toString()).emit('game', {
        event: gameEvents.updateBoard,
        data: {
          roomId: data.roomId,
          board: data.board,
        },
      });
      this.gameService
        .getNextPlayerFromCache(data.roomId)
        .then((playerIndex) => {
          console.log('Emit next player ', playerIndex);
          this.server.to(data.roomId.toString()).emit('game', {
            event: gameEvents.nextPlayer,
            data: {
              roomId: data.roomId,
              playerIndex,
            },
          });
        });
    }

    if (data.event === gameEvents.playerWins) {
      if (!data.playerId || !data.roomId || !data.playerName) {
        throw new WsException('Incorrect data');
      } else {
        this.server.to(data.roomId.toString()).emit('game', {
          event: gameEvents.playerWins,
          data: {
            playerId: data.playerId,
            playerName: data.playerName,
          },
        });
      }
    }
  }
}
