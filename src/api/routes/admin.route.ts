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
    this.router.post(`${this.path}register`, AuthAdminMiddleware, this.admin.registerAdmin);
    this.router.get(`${this.path}getAllClass`, this.admin.getAllClass);
    this.router.post(`${this.path}addClass`, this.admin.addClass);
    this.router.delete(`${this.path}deleteClass/:classId`, this.admin.deleteClass);
    this.router.post(`${this.path}updateClass/:classId`, this.admin.updateClass);
    this.router.post(`${this.path}searchClass`, this.admin.searchClass);
    this.router.get(`${this.path}getAllDepartment`, this.admin.getAllDepartment);
    this.router.get(`${this.path}addDepartment`, this.admin.addDepartment);
    this.router.delete(`${this.path}deleteDepartment/:departmentId`, this.admin.deleteDepartment);
    this.router.post(`${this.path}updateDepartment/:departmentId`, this.admin.updateDepartment);
  }
}
