import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ROOM_MODEL } from 'src/constants';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './interface/room.interface';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(ROOM_MODEL)
    private roomModel: Model<Room>,
  ) {}

  async create(createdRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(createdRoomDto);
    return createdRoom.save();
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

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
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
}
