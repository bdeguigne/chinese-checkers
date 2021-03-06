import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './interface/room.interface';
import { FindOneParams } from 'src/core/validators/find-one-params';
import { HttpExceptionFilter } from 'src/core/http-expection.filters';
import { TransformResponseInterceptor } from 'src/core/transform-response.interceptor';
import { PlayerParams } from './params/player.params';
import { StoreBoardDto } from './dto/store-board.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully created a new room'),
  )
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched all rooms'),
  )
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched this room'),
  )
  findOne(@Param() params: FindOneParams) {
    return this.roomsService.findOne(params.id);
  }

  @Get(':id/board')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched this room'),
  )
  async findBoard(@Param() params: FindOneParams) {
    const board = await this.roomsService.findBoard(params.id);
    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  @Patch(':id/player/add/:playerId')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor(
      'Successfully added a new player in this room',
    ),
  )
  addPlayer(@Param() params: PlayerParams) {
    return this.roomsService.addPlayer(params.id, params.playerId);
  }

  @Patch(':id/player/connect/:playerId')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully connected this player'),
  )
  connectPlayer(@Param() params: PlayerParams) {
    return this.roomsService.connectOrDisconnectPlayer(
      params.id,
      params.playerId,
      true,
    );
  }

  @Patch(':id/player/disconnect/:playerId')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully disconnected this player'),
  )
  disconnectPlayer(@Param() params: PlayerParams) {
    return this.roomsService.connectOrDisconnectPlayer(
      params.id,
      params.playerId,
      false,
    );
  }

  @Patch(':id/player/remove/:playerId')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor(
      'Successfully removed a player in this room',
    ),
  )
  removePlayer(@Param() params: PlayerParams) {
    return this.roomsService.removePlayer(params.id, params.playerId);
  }

  @Patch(':id/board')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully store board in this room'),
  )
  storeBoard(
    @Param() params: PlayerParams,
    @Body() storeBoardDto: StoreBoardDto,
  ) {
    return this.roomsService.storeBoardInDb(params.id, storeBoardDto.board);
  }

  @Delete('all')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully deleted all rooms'),
  )
  removeAll() {
    return this.roomsService.removeAll();
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully deleted this room'),
  )
  remove(@Param() params: FindOneParams) {
    return this.roomsService.remove(params.id);
  }
}
