import { Router } from 'express';
import { Routes } from '../../interfaces/routes.interface';
import { ExamController } from '../controllers/exam.controller';

export class ExamRoute implements Routes {
  public path = '/exam';
  public router = Router();
  public exam = new ExamController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(
    //   `${this.path}login`,
    //   //ValidationMiddleware(CreateUserDto),
    //   this.admin.loginAdmin,
    // );
  }
}
