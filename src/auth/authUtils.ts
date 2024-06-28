import jwt from 'jsonwebtoken';
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  EXPIRES_IN_ACCESS,
  EXPIRES_IN_REFRESH,
  PASSWORD_FORGOT_KEY,
  PASSWORD_FORGOT_EXPIRE_TIME,
} from '@config';
import { DataStoredInToken, DataStoredInTokenAdmin } from '@interfaces/auth.interface';

import { NextFunction } from 'express';

export type TTypekey = 'accessToken' | 'refreshToken';

export const createJwtToken = (payload: DataStoredInToken, typeKey: TTypekey) => {
  const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
  const expiresIn = typeKey === 'accessToken' ? EXPIRES_IN_ACCESS : EXPIRES_IN_REFRESH;
  const token = jwt.sign(payload, key, { expiresIn: expiresIn });
  return token;
};

export const verifyJwtToken = (token: string, typeKey: TTypekey, next: NextFunction) => {
  try {
    const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
    const data = jwt.verify(token, key) as DataStoredInToken;
    return data;
  } catch (err) {
    next(err);
  }
};
export const createJwtTokenAD = (payload: DataStoredInTokenAdmin, typeKey: TTypekey) => {
  const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
  const expiresIn = typeKey === 'accessToken' ? EXPIRES_IN_ACCESS : EXPIRES_IN_REFRESH;
  const token = jwt.sign(payload, key, { expiresIn: expiresIn });
  return token;
};

export const verifyJwtTokenAD = (token: string, typeKey: TTypekey, next: NextFunction) => {
  try {
    const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
    const data = jwt.verify(token, key) as DataStoredInTokenAdmin;
    return data;
  } catch (err) {
    next(err);
  }
};
export const decodeAccessToken = (
  token: string,
  next: NextFunction,
): DataStoredInTokenAdmin | null => {
  try {
    const data = jwt.verify(token, ACCESS_TOKEN) as DataStoredInTokenAdmin;
    return data;
  } catch (err) {
    next(err);
    return null;
  }
};

export const createJwtForgotPassword = (payload: DataStoredInToken) => {
  const key = PASSWORD_FORGOT_KEY;
  const expiresIn = PASSWORD_FORGOT_EXPIRE_TIME;
  const token = jwt.sign(payload, key, { expiresIn: expiresIn });
  return token;
};

export const verifyJwtForgotPassword = (token: string, next: NextFunction) => {
  try {
    const data = jwt.verify(token, PASSWORD_FORGOT_KEY) as DataStoredInToken;
    return data;
  } catch (err) {
    next(err);
  }
};

const generateTokens = async ({ _userId, _role }) => {
  const payload = {
    _id: _userId,
    role: _role,
  };

  const accessToken = createJwtToken(payload, 'accessToken');
  const refreshToken = createJwtToken(payload, 'refreshToken');

  return {
    accessToken,
    refreshToken,
  };
};

const generateKeysForgotPassword = async ({ _userId, _role }) => {
  const payload = {
    _id: _userId,
    role: _role,
  };

  return {
    token: createJwtForgotPassword(payload),
  };
};

export { generateTokens, generateKeysForgotPassword };
