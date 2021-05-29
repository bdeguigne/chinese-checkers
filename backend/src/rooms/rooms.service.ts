import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { PLAYER_MODEL, ROOM_MODEL } from 'src/constants';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomPlayerInfo } from './interface/room.interface';
import { Player } from 'src/players/interface/player.interface';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(ROOM_MODEL)
    private roomModel: Model<Room>,
    @Inject(PLAYER_MODEL)
    private playerModel: Model<Player>,
  ) {}

  async create(createdRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel();
    await createdRoom.save();
    const updatedRoomWithPlayer = await this.addPlayer(
      createdRoom.id,
      createdRoomDto.playerId,
      true,
    );
    console.log('UPDATED ROOM WITH PLAYER', updatedRoomWithPlayer);
    if (!updatedRoomWithPlayer) {
      throw new InternalServerErrorException();
    }
    return updatedRoomWithPlayer;
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async findOne(id: number): Promise<Room | null> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException();
    } else {
      return room;
    }
  }

  async findBoard(roomId: number): Promise<number[][][] | null> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      return null;
    } else {
      if (room.board.length === 0) {
        return null;
      } else {
        return room.board;
      }
    }
  }

  async addPlayer(
    id: number,
    playerId: number,
    isCreator?: boolean,
  ): Promise<Room | null> {
    const player = await this.playerModel.findById(playerId).exec();
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const room = await this.roomModel.findOne({ _id: id }).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const findPlayerInRoomResult = await this.roomModel
      .findOne({
        _id: id,
      })
      .exec();
    let playerPositionInArray = -1;
    if (findPlayerInRoomResult) {
      playerPositionInArray = this.findPlayerById(
        findPlayerInRoomResult,
        player._id,
      );
      if (playerPositionInArray === -1) {
        const update = isCreator
          ? {
              $push: {
                players: { info: player, playerIndex: room.playersCount },
              },
              $inc: {
                playersCount: 1,
              },
              creatorName: player.name,
            }
          : {
              $push: {
                players: { info: player, playerIndex: room.playersCount },
              },
              $inc: {
                playersCount: 1,
              },
            };
        return this.roomModel
          .findOneAndUpdate(
            {
              _id: id,
            },
            update,
            { new: true },
          )
          .exec();
      } else {
        throw new BadRequestException('This player is already in this room');
      }
    } else {
      throw new NotFoundException('Room not found');
    }
  }

  async connectOrDisconnectPlayer(
    id: number,
    playerId: number,
    isConnect: boolean,
  ): Promise<Room | null> {
    const player = await this.playerModel.findById(playerId).exec();
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const doesRoomExist = await this.roomModel.exists({ _id: id });
    if (!doesRoomExist) {
      throw new NotFoundException('Room not found');
    }
    const findPlayerInRoomResult = await this.roomModel
      .findOne({
        _id: id,
        'players.info._id': player._id,
      })
      .exec();
    if (findPlayerInRoomResult) {
      const findPlayerInConnectedList = await this.roomModel
        .findOne({
          _id: id,
          connectedPlayers: playerId,
        })
        .exec();
      if (isConnect === true && findPlayerInConnectedList) {
        throw new BadRequestException('This player is already connected');
      }
      if (isConnect === false && !findPlayerInConnectedList) {
        throw new BadRequestException('This player is not connected');
      }
      return this.roomModel
        .findOneAndUpdate(
          {
            _id: id,
          },
          isConnect
            ? {
                $push: {
                  connectedPlayers: playerId,
                },
              }
            : {
                $pull: {
                  connectedPlayers: playerId,
                },
              },
          { new: true },
        )
        .exec();
    } else {
      throw new BadRequestException('This player is not in this room');
    }
  }

  async remove(id: number): Promise<Room | null> {
    const deletedRoom = await this.roomModel
      .findByIdAndRemove({ _id: id }, { useFindAndModify: false })
      .exec();
    if (!deletedRoom) {
      throw new NotFoundException();
    } else {
      return deletedRoom;
    }
  }

  findPlayerById(room: Room, playerId: number): number {
    for (let i = 0; i < room.players.length; i++) {
      console.log('PLAYER ID', playerId);
      console.log('ROOM ID', room.players[i].info._id);
      if (room.players[i].info._id == playerId.toString()) {
        console.log('TRUE');
        return i;
      }
    }
    console.log('FALSE');
    return -1;
  }

  updatePlayerIndexWhenPlayersChange(
    removePlayerIndex: number,
    players: RoomPlayerInfo[],
  ): RoomPlayerInfo[] {
    players.forEach((player) => {
      if (player.playerIndex > removePlayerIndex) {
        player.playerIndex -= 1;
      }
    });
    return players;
  }

  async storeBoardInDb(
    roomId: number,
    board: number[][][],
  ): Promise<Room | null> {
    const doesRoomExist = await this.roomModel.exists({ _id: roomId });
    if (!doesRoomExist) {
      throw new NotFoundException('Room not found');
    }
    return await this.roomModel.findOneAndUpdate(
      {
        _id: roomId,
      },
      {
        $set: {
          board,
        },
      },
    );
  }

  async removePlayer(id: number, playerId: number): Promise<Room> {
    const player = await this.playerModel.findById(playerId).exec();
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const doesRoomExist = await this.roomModel.exists({ _id: id });
    if (!doesRoomExist) {
      throw new NotFoundException('Room not found');
    }
    const findPlayerInRoomResult = await this.roomModel
      .findOne({
        _id: id,
      })
      .exec();
    let playerPositionInArray = -1;
    if (findPlayerInRoomResult) {
      playerPositionInArray = this.findPlayerById(
        findPlayerInRoomResult,
        player._id,
      );
      if (playerPositionInArray !== -1) {
        const removePlayerIndex =
          findPlayerInRoomResult.players[playerPositionInArray].playerIndex;
        findPlayerInRoomResult.players.splice(playerPositionInArray, 1);
        findPlayerInRoomResult.playersCount =
          findPlayerInRoomResult.playersCount - 1;

        findPlayerInRoomResult.players =
          this.updatePlayerIndexWhenPlayersChange(
            removePlayerIndex,
            findPlayerInRoomResult.players,
          );
        await this.roomModel
          .updateOne({ _id: id }, findPlayerInRoomResult, { upsert: true })
          .exec();
        console.log('remove player', findPlayerInRoomResult);
        return findPlayerInRoomResult;
      } else {
        console.log('This player was not found in this room');
        throw new BadRequestException('This player was not found in this room');
      }
    }
    console.log('Room not found');
    throw new NotFoundException('Room not found');
  }

  async removeAll(): Promise<any> {
    return await this.roomModel.deleteMany({}).exec();
  }
}
