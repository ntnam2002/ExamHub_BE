import Redis from 'ioredis';
import { logger } from '@utils/logger';

const redisUrl =
  'redis://default:Oy4kRgyffVOAXhnXMj2J57CpfLuR8kBI@redis-16268.c302.asia-northeast1-1.gce.redns.redis-cloud.com:16268';

const redisClient = new Redis(redisUrl);

redisClient.on('connect', () => logger.info('🟢 Cache is connecting'));
redisClient.on('ready', () => logger.info('🟢 Cache is ready'));
redisClient.on('end', () => logger.info('🔴 Cache disconnected'));
redisClient.on('reconnecting', () => logger.info('🟢 Cache is reconnecting'));
redisClient.on('error', e => logger.error(e));

export const redis = redisClient;
