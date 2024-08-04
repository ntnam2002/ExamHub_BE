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
    // Routes for managing questions
    this.router.get(`${this.path}/allquestions`, this.examController.getAllQuestions);
    this.router.post(`${this.path}/questions`, this.examController.createQuestion);
    this.router.get(`${this.path}/questions/:id`, this.examController.getQuestionById);
    this.router.put(`${this.path}/questions/:id`, this.examController.updateQuestion);
    this.router.delete(`${this.path}/questions/:id`, this.examController.deleteQuestion);

    // Routes for managing exams
    this.router.get(this.path, this.examController.getExams);
    this.router.get(`${this.path}/:id`, this.examController.getExamById);
    this.router.post(this.path, this.examController.createExam);
    this.router.put(`${this.path}/:id`, this.examController.updateExam);
    this.router.delete(`${this.path}/:id`, this.examController.deleteExam);

    // Routes for managing examinations
    this.router.post(`${this.path}/examination/addExam`, this.examController.addExamToExamination);
    this.router.post(`${this.path}/add-question`, this.examController.addQuestionToExam);
    this.router.post(`${this.path}/remove-question`, this.examController.removeQuestionFromExam);
    this.router.post(`${this.path}/:examId/score/:studentId`, this.examController.calculateScore);

    // Routes for managing examination data
    this.router.get(`${this.path}/examinations/getAll`, this.examController.getExaminations);
    this.router.get(`${this.path}/examinations/:id`, this.examController.getExaminationById);
    this.router.post(`${this.path}/examinations`, this.examController.createExamination);
    this.router.put(`${this.path}/examinations/:id`, this.examController.updateExamination);
    this.router.delete(`${this.path}/examinations/:id`, this.examController.deleteExamination);
    this.router.post(
      `${this.path}/examinations/addStudent/:examinationId`,
      this.examController.addStudentToExamination,
    );
    this.router.get(
      `${this.path}/examinations/student/:studentId`,
      this.examController.getExaminationByStudentId,
    );
    this.router.get(
      `${this.path}/examinations/questions/:examinationId`,
      this.examController.getExaminationData,
    );
    this.router.get(
      `${this.path}/examinations/:examinationId/score/:studentId`,
      this.examController.getScore,
    );
  }
}
