import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameDto } from './dto/join-lobby.dto';
import { Cache } from 'cache-manager';
// import { Room } from 'src/rooms/interface/room.interface';
import { gameEvents } from './game.gateway';
import { Room } from 'src/rooms/interface/room.interface';
import { PlayersService } from 'src/players/players.service';
import { ChineseCheckersEngine } from 'src/engine/engine';

@Injectable()
export class GameService {
  constructor(
    @Inject('RoomsService')
    private readonly roomsService: RoomsService,
    @Inject('PlayersService')
    private readonly playersService: PlayersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async storeRoomInCache(roomId: number): Promise<Room | null> {
    const room = await this.roomsService.findOne(roomId);
    console.log('OKAY STORE ROOM', room);
    if (room) {
      await this.cacheManager.set<Room>(`room-${roomId.toString()}`, room, {
        ttl: 10000,
      });
      await this.cacheManager.set<number>(
        `playerIndex-${roomId.toString()}`,
        0,
        {
          ttl: 10000,
        },
      );
    }
    return room;
  }

  async storeBoardInCache(roomId: number, playersCount: number) {
    let boardAlreadyStored = false;
    const boardFromDb = await this.roomsService.findBoard(roomId);
    if (boardFromDb) {
      boardAlreadyStored = true;
    } else {
      const boardCache = await this.cacheManager.get<number[][][]>(
        `board-${roomId.toString()}`,
      );
      if (boardCache) {
        boardAlreadyStored = true;
      }
    }

    if (boardAlreadyStored === false) {
      const engine = new ChineseCheckersEngine(playersCount);
      await this.cacheManager.set<number[][][]>(
        `board-${roomId.toString()}`,
        engine.board.coords,
        {
          ttl: 10000,
        },
      );
    }
  }

  async updateBoard(board: number[][][], roomId: number) {
    await this.cacheManager.set<number[][][]>(
      `board-${roomId.toString()}`,
      board,
      {
        ttl: 10000,
      },
    );
  }

  async assignPlayerWithSocketId(
    playerId: number,
    roomId: number,
    socketId: string,
  ) {
    await this.cacheManager.set<PlayerSocket>(
      `player-${socketId.toString()}`,
      { playerId: playerId, roomId: roomId, socketId },
      {
        ttl: 10000,
      },
    );
  }

  async getBoardDataAndEmit(
    roomId: number,
  ): Promise<WsResponse<StartGameReponse>> {
    const board = await this.cacheManager.get<number[][][]>(
      `board-${roomId.toString()}`,
    );

    const playerIndexCache = await this.cacheManager.get<number>(
      `playerIndex-${roomId.toString()}`,
    );

    if (board) {
      console.log('Board from cache !');
      return {
        event: gameEvents.start,
        data: {
          roomId: roomId.toString(),
          playerIndex: playerIndexCache,
          board: board,
        },
      };
    } else {
      const boardFromDb = await this.roomsService.findBoard(roomId);
      if (boardFromDb) {
        console.log('Board from Db !');
        return {
          event: gameEvents.start,
          data: {
            roomId: roomId.toString(),
            playerIndex: playerIndexCache,
            board: boardFromDb,
          },
        };
      } else {
        throw new WsException('Cannot find board data');
      }
    }
  }

  async connectPlayer(data: GameDto): Promise<WsResponse<StartGameReponse>> {
    try {
      await this.playersService.addGame(data.playerId, data.roomId);
      const room = await this.roomsService.connectOrDisconnectPlayer(
        data.roomId,
        data.playerId,
        true,
      );
      if (room) {
        const roomPlayerIds: any[] = [];
        room.players.forEach((player) => {
          roomPlayerIds.push(player.info._id);
        });

        if (
          roomPlayerIds.sort().join(',') ===
          room.connectedPlayers.sort().join(',')
        ) {
          return this.getBoardDataAndEmit(room._id);
        } else {
          return {
            event: gameEvents.notReady,
            data: {
              roomId: room._id,
            },
          };
        }
      } else {
        throw new WsException('Cannot find this room');
      }
    } catch (e) {
      throw new WsException(e.response.message);
    }
  }

  async disconnectPlayer(
    roomId: number,
    playerId: number,
  ): Promise<WsResponse<StartGameReponse>> {
    try {
      const room = await this.roomsService.connectOrDisconnectPlayer(
        roomId,
        playerId,
        false,
      );
      if (room) {
        if (room.connectedPlayers.length === 0) {
          const board = await this.cacheManager.get<number[][][]>(
            `board-${roomId.toString()}`,
          );
          if (board) {
            console.log('ALL PLAYERS LEFT');
            const updatedRoom = this.roomsService.storeBoardInDb(roomId, board);
            if (!updatedRoom) {
              throw new WsException('Cannot update room with board');
            }
          }
        }
        const roomPlayerIds: any[] = [];
        room.players.forEach((player) => {
          roomPlayerIds.push(player.info._id);
        });

        if (
          roomPlayerIds.sort().join(',') ===
          room.connectedPlayers.sort().join(',')
        ) {
          return this.getBoardDataAndEmit(room._id);
        } else {
          return {
            event: gameEvents.notReady,
            data: {
              roomId: room._id,
            },
          };
        }
      } else {
        throw new WsException('Cannot find this room');
      }
    } catch (e) {
      throw new WsException(e.response.message);
    }
  }

  async getNextPlayerFromCache(roomId: number): Promise<number> {
    const roomCache = await this.cacheManager.get<Room>(
      `room-${roomId.toString()}`,
    );
    const playerIndexCache = await this.cacheManager.get<number>(
      `playerIndex-${roomId.toString()}`,
    );
    if (roomCache && playerIndexCache != undefined) {
      const player = roomCache.players[playerIndexCache + 1];
      let playerIndex = playerIndexCache;
      if (player) {
        playerIndex += 1;
      } else {
        playerIndex = 0;
      }
      await this.cacheManager.set<number>(
        `playerIndex-${roomId.toString()}`,
        playerIndex,
        {
          ttl: 10000,
        },
      );
      return playerIndex;
    }
    return -1;
  }
}
