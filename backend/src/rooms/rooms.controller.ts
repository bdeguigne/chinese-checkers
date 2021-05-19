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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './interface/room.interface';
import { FindOneParams } from 'src/core/validators/find-one-params';
import { HttpExceptionFilter } from 'src/core/http-expection.filters';
import { TransformResponseInterceptor } from 'src/core/transform-response.interceptor';

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

  // @Get()
  // watchAll(): Observable<Room[]> {
  //   return of(this.roomsService.findAll());
  // }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched this room'),
  )
  findOne(@Param() params: FindOneParams) {
    return this.roomsService.findOne(params.id);
  }

  @Patch(':id')
  @UseFilters(new HttpExceptionFilter())
  update(@Param() params: FindOneParams, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(params.id, updateRoomDto);
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
