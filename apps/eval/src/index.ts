import express from 'express';
import { Redis } from 'ioredis';

const app = express();
const port = process.env.PORT ?? 5000;
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

const redis = new Redis(redisUrl);

app.get('/eval/:key', async (req, res) => {
  const { key } = req.params;

  const raw = await redis.get('flags:all');
  if (!raw) {
    res.status(503).json({ error: 'Cache not available' });
    return;
  }

  const flags: Array<{ key: string; enabled: boolean }> = JSON.parse(raw);
  const flag = flags.find((f) => f.key === key);

  if (!flag) {
    res.status(404).json({ error: `Flag "${key}" not found` });
    return;
  }

  res.json({ key: flag.key, enabled: flag.enabled });
});

app.listen(port, () => {
  console.log(`Eval service running on port ${port}`);
});
