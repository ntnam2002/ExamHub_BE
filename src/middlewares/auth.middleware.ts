import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN, SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AdminModel, UserModel } from '@models/users.model';
import { verifyJwtToken } from '@/auth/authUtils';

const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
export const AuthAdminMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id, role } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await AdminModel.findById(_id);

      if (role === 'student' || role === 'PARENT') {
        next(new HttpException(403, 'Wrong authentication token'));
      }

      if (findUser?.role === 'admin') {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
