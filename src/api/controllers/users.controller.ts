import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { UserService } from '@/api/services/users.service';
import { OK } from '@/helpers/valid_responses/success.response';
import { IUser, User } from '@/interfaces/users.interface';

export class UserController {
  public user = Container.get(UserService);
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: IUser = req.body;
      const result = await this.user.login(data);
      new OK({
        message: 'Login admin success',
        data: {
          username: result.usernameAdmin,
          authority: result.role,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: User = req.body;
      const result = await this.user.register(data);
      new OK({
        message: 'Register admin success',
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public getAllStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.user.getAllStudents();
      new OK({
        message: 'Get admin success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const result = await this.user.deleteUser(userId);
      new OK({
        message: 'Delete admin success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public getAllTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.user.getAllTeachers();
      new OK({
        message: 'Get admin success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const data: User = req.body;
      const result = await this.user.updateUser(userId, data);
      new OK({
        message: 'Update admin success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
