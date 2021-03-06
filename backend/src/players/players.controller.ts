import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { TransformResponseInterceptor } from 'src/core/transform-response.interceptor';
import { HttpExceptionFilter } from 'src/core/http-expection.filters';
import { FindOneParams } from 'src/core/validators/find-one-params';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully created a new player'),
  )
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched all players'),
  )
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully fetched this player'),
  )
  findOne(@Param() params: FindOneParams) {
    return this.playersService.findOne(params.id);
  }

  @Patch(':id/win')
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully updated this player'),
  )
  @UseFilters(new HttpExceptionFilter())
  addWin(@Param() params: FindOneParams) {
    return this.playersService.addWin(params.id);
  }

  @Patch(':id/lose')
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully updated this player'),
  )
  @UseFilters(new HttpExceptionFilter())
  addLoose(@Param() params: FindOneParams) {
    return this.playersService.addLoose(params.id);
  }

  @Delete('all')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully deleted all players'),
  )
  removeAll() {
    return this.playersService.removeAll();
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(
    new TransformResponseInterceptor('Successfully deleted this player'),
  )
  remove(@Param() params: FindOneParams) {
    return this.playersService.remove(params.id);
  }
}
