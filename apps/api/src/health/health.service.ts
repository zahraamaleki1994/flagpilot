import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Connection } from 'mongoose';
import { REDIS_CLIENT } from '../redis/redis.module';

export type Status = 'up' | 'down';

export interface HealthReport {
  status: 'ok' | 'error';
  mongo: Status;
  redis: Status;
}

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly mongo: Connection,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async check(): Promise<HealthReport> {
    const mongo = await this.ping(() => this.mongo.db!.admin().ping());
    const redis = await this.ping(() => this.redis.ping());
    const ok = mongo === 'up' && redis === 'up';
    return { status: ok ? 'ok' : 'error', mongo, redis };
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
