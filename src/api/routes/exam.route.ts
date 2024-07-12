import { Router } from 'express';
import { Routes } from '../../interfaces/routes.interface';
import { ExamController } from '../controllers/exam.controller';

export class ExamRoute implements Routes {
  public path = '/exams';
  public router = Router();
  public examController = new ExamController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/questions`, this.examController.getAllQuestions);
    this.router.post(`${this.path}/questions`, this.examController.createQuestion);
    this.router.get(`${this.path}/questions/:id`, this.examController.getQuestionById);
    this.router.put(`${this.path}/questions/:id`, this.examController.updateQuestion);
    this.router.delete(`${this.path}/questions/:id`, this.examController.deleteQuestion);

    this.router.get(this.path, this.examController.getExams);
    this.router.get(`${this.path}/:id`, this.examController.getExamById);
    this.router.post(this.path, this.examController.createExam);
    this.router.put(`${this.path}/:id`, this.examController.updateExam);
    this.router.delete(`${this.path}/:id`, this.examController.deleteExam);

    this.router.post(`${this.path}/add-question`, this.examController.addQuestionToExam);
    this.router.post(`${this.path}/remove-question`, this.examController.removeQuestionFromExam);
  }
}
