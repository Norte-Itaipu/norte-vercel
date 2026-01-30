import { createClient } from 'redis';

const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
};

export const getCachedData = async (key: string) => {
  const client = await getRedisClient();
  const cachedData = await client.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

export const setCachedData = async (key: string, data: any, ttl: number = 3600) => {
  const client = await getRedisClient();
  await client.setEx(key, ttl, JSON.stringify(data));
};

export const clearCache = async (pattern: string) => {
  const client = await getRedisClient();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
};