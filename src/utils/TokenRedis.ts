import { redis } from '@/database/redis.database';

export async function saveRefreshTokenToRedis(refreshToken: string, userId: string): Promise<void> {
  try {
    await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 30); // 30 ngày
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}
