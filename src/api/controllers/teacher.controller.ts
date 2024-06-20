import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Admin, IAdmin } from '../../interfaces/users.interface';
import { AdminService } from '../services/admin.service';
import { OK } from '../../helpers/valid_responses/success.response';
import { TeacherService } from '../services/teacher.service';
export class TeacherController {
  public teacher = Container.get(TeacherService);
  public loginTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const login = await this.teacher.loginTeacher(data);
      new OK({
        message: 'Login teacher success',
        data: {
          accessToken: login.accessToken,
          refreshToken: login.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public registerTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAdmin = req.body;
      const register = await this.teacher.registerTeacher(data);
      new OK({
        message: 'Register teacher success',
        data: {
          accessToken: register.accessToken,
          refreshToken: register.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
