import { Request } from 'express';

export interface DataStoredInToken {
  _id: string;
}
export interface RequestWithUser extends Request {
  user: any;
}
export interface TokenData {
  token: string;
  expiresIn: number;
}