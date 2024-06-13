import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@/api/services/auth.service';
import { Admin } from '../../interfaces/users.interface';

export class AdminController {
  public admin = Container.get(AdminController);
  public loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminData: Admin = req.body;
      const loginAdminData: Admin = await this.admin.loginAdmin(adminData);

      res.status(200).json({ data: loginAdminData, message: 'loginAdmin' });
    } catch (error) {
      next(error);
    }
  };
}
