import { Router } from 'express';

import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthAdminMiddleware, AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminController } from '../controllers/admin.controller';

export class AdminRoute implements Routes {
  public path = '/admin/';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}login`,
      //ValidationMiddleware(CreateUserDto),
      this.admin.loginAdmin,
    );
    this.router.post(`${this.path}register`, this.admin.registerAdmin);
  }
}
