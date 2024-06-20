import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { UserService } from '@/api/services/users.service';
import { OK } from '@/helpers/valid_responses/success.response';

export class UserController {
  public user = Container.get(UserService);
  public loginStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const login = await this.user.loginStudent(data);
      new OK({
        message: 'Login student success',
        data: {
          accessToken: login.accessToken,
          refreshToken: login.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
