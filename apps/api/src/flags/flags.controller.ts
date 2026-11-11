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

@Controller('flags')
@UseGuards(JwtAuthGuard)
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  create(
    @Body() body: { key: string; description: string },
    @Req() req: { user: { email: string } },
  ) {
    return this.flagsService.create(body.key, body.description, req.user.email);
  }

  @Get()
  findAll() {
    return this.flagsService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.flagsService.findOne(key);
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() body: { enabled?: boolean; description?: string },
  ) {
    return this.flagsService.update(key, body.enabled, body.description);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.flagsService.remove(key);
  }
}
