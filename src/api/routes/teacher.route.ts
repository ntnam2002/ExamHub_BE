import { Router } from 'express';

import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthAdminMiddleware, AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

import { TeacherController } from '../controllers/teacher.controller';

export class TeacherRoute implements Routes {
  public path = '/teacher/';
  public router = Router();
  public teacher = new TeacherController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}login`,
      //ValidationMiddleware(CreateUserDto),
      this.teacher.loginTeacher,
    );
    this.router.post(`${this.path}register`, this.teacher.registerTeacher);
  }
}
