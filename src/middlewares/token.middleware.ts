import { redis } from '@/database/redis.database';
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

export const checkTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, 'accessToken'); // Thay 'your-secret-key' bằng secret key của bạn
    const userId = decoded._id;
    const refreshToken = await redis.get(`refreshToken:${userId}`);

    if (!refreshToken) {
      return res.status(401).send({ message: 'Logged out' });
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};
