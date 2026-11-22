import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FlagsService } from './flags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { FlagKeyParamDto } from './dto/flag-key-param.dto';

@Controller('flags')
@UseGuards(JwtAuthGuard)
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  create(@Body() body: CreateFlagDto, @Req() req: { user: { email: string } }) {
    return this.flagsService.create(body.key, body.description, req.user.email);
  }

  @Get()
  findAll() {
    return this.flagsService.findAll();
  }

  @Get(':key')
  findOne(@Param() params: FlagKeyParamDto) {
    return this.flagsService.findOne(params.key);
  }

  @Patch(':key')
  update(@Param() params: FlagKeyParamDto, @Body() body: UpdateFlagDto) {
    return this.flagsService.update(params.key, body.enabled, body.description);
  }

  @Delete(':key')
  remove(@Param() params: FlagKeyParamDto) {
    return this.flagsService.remove(params.key);
  }
}
