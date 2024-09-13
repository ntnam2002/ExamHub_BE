import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
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
    this.router.get(`${this.path}/getAllBehavior`, this.management.getAllBehaviorHistories);
    this.router.get(`${this.path}/searchBehavior`, this.management.searchBehaviorHistories);

    this.router.get(`${this.path}/getAllLoginLogs`, this.management.getAllLoginLogs);

    this.router.get(`${this.path}/subject`, this.management.getAllSubject);
    this.router.get(`${this.path}/subject/:id`, this.management.getSubjectById);
    this.router.post(`${this.path}/subject`, this.management.createSubject);
    this.router.put(`${this.path}/subject/:id`, this.management.updateSubject);
    this.router.delete(`${this.path}/subject/:id`, this.management.deleteSubject);

    this.router.get(`${this.path}/statistic`, this.management.systemStatistics);
    this.router.get(`${this.path}/searchStatistic`, this.management.searchSystemStatistics);
    this.router.get(`${this.path}/getResultForStudent`, this.management.getResultByStudentId);
  }
}
