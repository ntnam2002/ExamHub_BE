import { Request } from 'express';

export interface DataStoredInToken {
  _id: string;
  role?: string;
}
export interface DataStoredInTokenAdmin {
  User: string;
  Role: string;
}
export interface RequestWithUser extends Request {
  _id: string;
  user: any;
}
export interface TokenData {
  token: string;
  expiresIn: number;
}
