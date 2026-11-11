import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlagsController } from './flags.controller';
import { FlagsService } from './flags.service';
import { Flag, FlagSchema } from './flag.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flag.name, schema: FlagSchema }]),
    AuthModule,
  ],
  controllers: [FlagsController],
  providers: [FlagsService],
})
export class FlagsModule {}
