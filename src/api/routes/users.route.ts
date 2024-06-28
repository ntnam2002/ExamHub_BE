import { Router } from 'express';
import { UserController } from '@/api/controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, ValidationMiddleware(CreateUserDto), this.user.login);
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(CreateUserDto),
      this.user.register,
    );
    this.router.get(`${this.path}/getAllstudents`, this.user.getAllStudent);
    this.router.get(`${this.path}/getAllTeachers`, this.user.getAllTeacher);
    this.router.delete(`${this.path}/:id`, this.user.deleteUser);
    this.router.post(`${this.path}/updateUser`, this.user.updateUser);
  }
}
