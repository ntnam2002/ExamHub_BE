import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN, ACCESS_TOKEN, EXPIRES_IN_ACCESS, EXPIRES_IN_REFRESH } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';

import { NextFunction } from 'express';

type TTypekey = 'accessToken' | 'refreshToken';

const refreshTokens = [];
export function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: EXPIRES_IN_ACCESS });
}
export function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, REFRESH_TOKEN, { expiresIn: EXPIRES_IN_REFRESH });
  refreshTokens.push(refreshToken);
  return refreshToken;
}
