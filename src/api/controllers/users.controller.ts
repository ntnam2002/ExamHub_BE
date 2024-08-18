import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { UserService } from '@/api/services/users.service';
import { OK } from '@/helpers/valid_responses/success.response';
import { IUser, User, UserRegister, UserUpdate } from '@/interfaces/users.interface';

export class UserController {
  public user = Container.get(UserService);

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: IUser = req.body;
      const result = await this.user.login(data);
      new OK({
        message: 'Đăng nhập thành công',
        data: {
          username: result.Username,
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
      const data: UserRegister = req.body;
      const result = await this.user.register(data);
      new OK({
        message: 'Register success',
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
        message: 'Get User success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public getStudentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const result = await this.user.getStudentById(userId);
      new OK({
        message: 'Get User success',
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
        message: 'Delete User success',
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
  public getTeacherById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const result = await this.user.getTeacherById(userId);
      new OK({
        message: 'Get Teacher success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const data: UserUpdate = req.body;
      console.log('data', data);
      console.log('userId', userId);
      const result = await this.user.updateUser(userId, data);
      new OK({
        message: 'Update User success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
