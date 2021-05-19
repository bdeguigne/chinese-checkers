import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PLAYER_MODEL } from 'src/constants';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './interface/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @Inject(PLAYER_MODEL)
    private playerModel: Model<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdRoom = new this.playerModel(createPlayerDto);
    return createdRoom.save();
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findOne(id: number): Promise<Player | null> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException();
    } else {
      return player;
    }
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  async remove(id: number): Promise<Player | null> {
    const deletedPlayer = await this.playerModel
      .findByIdAndRemove({ _id: id }, { useFindAndModify: false })
      .exec();
    if (!deletedPlayer) {
      throw new NotFoundException();
    } else {
      return deletedPlayer;
    }
  }
}
