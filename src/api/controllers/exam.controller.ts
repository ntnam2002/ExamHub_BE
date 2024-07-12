import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/httpException';
import { OK, Created, NoContent } from '@/helpers/valid_responses/success.response';
import { Container } from 'typedi';
import { ExamService } from '../services/exam.service';

@Service()
export class ExamController {
  private examService = Container.get(ExamService);

  public async getAllQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await this.examService.getAllQuestions();
      new OK({
        message: 'Get all questions success',
        data: questions,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await this.examService.createQuestion(req.body);
      new Created({
        message: 'Question created successfully',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await this.examService.getQuestionById(req.params.id);
      new OK({
        message: 'Get question by ID success',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await this.examService.updateQuestion(req.params.id, req.body);
      new OK({
        message: 'Question updated successfully',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      await this.examService.deleteQuestion(req.params.id);
      new NoContent({
        message: 'Question deleted successfully',
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async getExams(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await this.examService.getExams();
      new OK({
        message: 'Get exams success',
        data: exams,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async getExamById(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await this.examService.getExamById(req.params.id);
      new OK({
        message: 'Get exam by ID success',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await this.examService.createExam(req.body);
      new Created({
        message: 'Exam created successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async updateExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await this.examService.updateExam(req.params.id, req.body);
      new OK({
        message: 'Exam updated successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async deleteExam(req: Request, res: Response, next: NextFunction) {
    try {
      await this.examService.deleteExam(req.params.id);
      new NoContent({
        message: 'Exam deleted successfully',
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async addQuestionToExam(req: Request, res: Response, next: NextFunction) {
    try {
      const { examId, questionId } = req.body;
      const exam = await this.examService.addQuestionToExam(examId, questionId);
      new OK({
        message: 'Question added to exam successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }

  public async removeQuestionFromExam(req: Request, res: Response, next: NextFunction) {
    try {
      const { examId, questionId } = req.body;
      const exam = await this.examService.removeQuestionFromExam(examId, questionId);
      new OK({
        message: 'Question removed from exam successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }
}
