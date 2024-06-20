import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Admin, IAdmin } from '../../interfaces/users.interface';
import { AdminService } from '../services/admin.service';
import { OK } from '../../helpers/valid_responses/success.response';
export class AdminController {
  public admin = Container.get(AdminService);
  public loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const login = await this.admin.loginAdmin(data);
      new OK({
        message: 'Login admin success',
        data: {
          accessToken: login.accessToken,
          refreshToken: login.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAdmin = req.body;
      const register = await this.admin.registerAdmin(data);
      new OK({
        message: 'Register admin success',
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
