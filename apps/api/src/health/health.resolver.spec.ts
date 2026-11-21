import { Test, TestingModule } from '@nestjs/testing';
import { HealthResolver } from './health.resolver';
import { HealthReport, HealthService } from './health.service';

describe('HealthResolver', () => {
  let resolver: HealthResolver;
  const healthService = { check: jest.fn<Promise<HealthReport>, []>() };

  beforeEach(async () => {
    healthService.check.mockReset();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HealthResolver,
        { provide: HealthService, useValue: healthService },
      ],
    }).compile();

    resolver = moduleRef.get(HealthResolver);
  });

  it('returns "ok" when MongoDB and Redis are up', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      mongo: 'up',
      redis: 'up',
    });

    await expect(resolver.health()).resolves.toEqual({
      status: 'ok',
      mongo: 'up',
      redis: 'up',
    });
    expect(healthService.check).toHaveBeenCalledTimes(1);
  });

  it('returns "error" when a dependency is down', async () => {
    healthService.check.mockResolvedValue({
      status: 'error',
      mongo: 'up',
      redis: 'down',
    });

    const result = await resolver.health();

    expect(result.status).toBe('error');
    expect(result.redis).toBe('down');
  });
});
