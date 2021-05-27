import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PLAYER_MODEL } from 'src/constants';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interface/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @Inject(PLAYER_MODEL)
    private playerModel: Model<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return createdPlayer.save();
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

  async removeAll(): Promise<any> {
    return await this.playerModel.deleteMany({}).exec();
  }

  async addGame(playerId: number, roomId: number): Promise<Player> {
    const player = await this.playerModel
      .findByIdAndUpdate({ _id: playerId }, { $set: { gameId: roomId } })
      .exec();

    if (player == null) {
      throw new NotFoundException('Cannot set a game for this player');
    } else {
      return player;
    }
  }

  async isPlayerIsInGame(playerId: number): Promise<number | null> {
    const player = await this.playerModel.findById(playerId);
    if (player) {
      if (player.gameId) {
        return player.gameId;
      }
    }
    return null;
  }
}
