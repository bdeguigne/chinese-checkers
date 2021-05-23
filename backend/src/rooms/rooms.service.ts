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
import { Room } from './interface/room.interface';
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

  async addPlayer(
    id: number,
    playerId: number,
    isCreator?: boolean,
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
        'players._id': player._id,
      })
      .exec();
    if (findPlayerInRoomResult == null) {
      const update = isCreator
        ? {
            $push: {
              players: player,
            },
            $inc: {
              playersCount: 1,
            },
            creatorName: player.name,
          }
        : {
            $push: {
              players: player,
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

  async removePlayer(id: number, playerId: number): Promise<Player> {
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
        'players._id': player._id,
      })
      .exec();

    if (findPlayerInRoomResult) {
      await this.roomModel
        .updateOne(
          { _id: id },
          {
            $pull: {
              players: {
                _id: player._id,
              },
            },
            $inc: {
              playersCount: -1,
            },
          },
        )
        .exec();
    } else {
      throw new BadRequestException('This player was not found in this room');
    }
    return player;
  }

  async removeAll(): Promise<any> {
    return await this.roomModel.deleteMany({}).exec();
  }
}
