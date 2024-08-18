import { Router } from 'express';
import { UserController } from '@/api/controllers/users.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { ManagemnentController } from '../controllers/management.controller';

export class ManagementRoute implements Routes {
  public path = '/management';
  public router = Router();
  public management = new ManagemnentController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/behavior`, this.management.managementStudentBehavior);

    this.router.get(`${this.path}/subject`, this.management.getAllSubject);
    this.router.get(`${this.path}/subject/:id`, this.management.getSubjectById);
    this.router.post(`${this.path}/subject`, this.management.createSubject);
    this.router.put(`${this.path}/subject/:id`, this.management.updateSubject);
    this.router.delete(`${this.path}/subject/:id`, this.management.deleteSubject);
  }
}
