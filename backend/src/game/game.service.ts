import { Inject, Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameDto } from './dto/join-lobby.dto';
import { gameEvents } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    @Inject('RoomsService')
    private readonly roomsService: RoomsService,
  ) {}

  async connectPlayer(data: GameDto): Promise<WsResponse<StartGameReponse>> {
    try {
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
        const found = roomPlayerIds.some((r) =>
          room.connectedPlayers.includes(r),
        );

        if (found) {
          return {
            event: gameEvents.start,
            data: {
              roomId: room._id,
              playerIndex: 0,
            },
          };
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
      throw new WsException('Cannot connect player');
    }
  }
}
