import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Flag, FlagDocument } from './flag.schema';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class FlagsService {
  constructor(
    @InjectModel(Flag.name) private flagModel: Model<FlagDocument>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private async syncToRedis(): Promise<void> {
    const flags = await this.flagModel.find();
    await this.redis.set('flags:all', JSON.stringify(flags));
  }

  async create(
    key: string,
    description: string | undefined,
    createdBy: string,
  ) {
    const existing = await this.flagModel.findOne({ key });
    if (existing) throw new ConflictException(`Flag "${key}" already exists`);
    const flag = await this.flagModel.create({ key, description, createdBy });
    await this.syncToRedis();
    return flag;
  }

  async findAll() {
    return this.flagModel.find();
  }

  async findOne(key: string) {
    const flag = await this.flagModel.findOne({ key });
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    return flag;
  }

  async update(key: string, enabled?: boolean, description?: string) {
    const flag = await this.flagModel.findOneAndUpdate(
      { key },
      {
        ...(enabled !== undefined && { enabled }),
        ...(description !== undefined && { description }),
      },
      { returnDocument: 'after' },
    );
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    await this.syncToRedis();
    return flag;
  }

  async remove(key: string) {
    const flag = await this.flagModel.findOneAndDelete({ key });
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    await this.syncToRedis();
    return { deleted: true };
  }
}
