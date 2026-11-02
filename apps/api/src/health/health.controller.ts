import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Connection } from 'mongoose';
import { REDIS_CLIENT } from '../redis/redis.module';

type Status = 'up' | 'down';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongo: Connection,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Get()
  async check() {
    const mongo = await this.ping(() => this.mongo.db!.admin().ping());
    const redis = await this.ping(() => this.redis.ping());
    const ok = mongo === 'up' && redis === 'up';
    const body = { status: ok ? 'ok' : 'error', mongo, redis };

    if (!ok) {
      throw new HttpException(body, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return body;
  }

  private async ping(check: () => Promise<unknown>): Promise<Status> {
    try {
      await Promise.race([
        check(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1000),
        ),
      ]);
      return 'up';
    } catch {
      return 'down';
    }
  }
}
