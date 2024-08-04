import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { OK, Created } from '@/helpers/valid_responses/success.response';
import { Container } from 'typedi';
import { ExamService } from '../services/exam.service';
import { IExamination, studentAddToExamination } from '@/interfaces/exam.interface';

@Service()
export class ExamController {
  private examService = Container.get(ExamService);

  public getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questions = await this.examService.getAllQuestions();
      new OK({
        message: 'Get all questions success',
        data: questions,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await this.examService.createQuestion(req.body);
      new Created({
        message: 'Question created successfully',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await this.examService.getQuestionById(req.params.id);
      new OK({
        message: 'Get question by ID success',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await this.examService.updateQuestion(req.params.id, req.body);
      new OK({
        message: 'Question updated successfully',
        data: question,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.examService.deleteQuestion(req.params.id);
      new OK({
        message: 'Question deleted successfully',
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exams = await this.examService.getExams();
      new OK({
        message: 'Get exams success',
        data: exams,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getExamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exam = await this.examService.getExamById(req.params.id);
      new OK({
        message: 'Get exam by ID success',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public createExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exam = await this.examService.createExam(req.body);
      new Created({
        message: 'Exam created successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public updateExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exam = await this.examService.updateExam(req.params.id, req.body);
      new OK({
        message: 'Exam updated successfully',
        data: exam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public deleteExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.examService.deleteExam(req.params.id);
      new OK({
        message: 'Exam deleted successfully',
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public addQuestionToExam = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  public removeQuestionFromExam = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  public getExaminations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const examinations: IExamination[] = await this.examService.getExaminations();
      res.json({ data: examinations });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getExaminationByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.params;

      const examinations = await this.examService.getExaminationByStudentId(studentId);
      new OK({ message: 'Get examinations by student ID success', data: examinations }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public addStudentToExamination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examinationId } = req.params;
      const data: studentAddToExamination = req.body;
      await this.examService.addStudentToExamination(examinationId, data);
      new OK({
        message: 'Student added to examination successfully',
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public addExamToExamination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examId, examinationId } = req.body;
      const examination = await this.examService.addExamToExamination(examinationId, examId);
      new OK({
        message: 'Exam added to examination successfully',
        data: examination,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getExaminationData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examinationId } = req.params;
      const examinationData = await this.examService.getExaminationData(examinationId);
      new OK({
        message: 'Get examination data success',
        data: examinationData,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public createExamination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newExamination: IExamination = await this.examService.createExamination(req.body);
      res.status(201).json({ data: newExamination });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getExaminationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const examinationId: string = req.params.id;
      const examination: IExamination | null = await this.examService.getExaminationById(
        examinationId,
      );
      if (!examination) {
        throw new HttpException(404, 'Examination not found');
      }
      res.json({ data: examination });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public updateExamination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const examinationId: string = req.params.id;
      const updatedExamination: IExamination | null = await this.examService.updateExamination(
        examinationId,
        req.body,
      );
      if (!updatedExamination) {
        throw new HttpException(404, 'Examination not found');
      }
      res.json({ data: updatedExamination });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public deleteExamination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const examinationId: string = req.params.id;
      const deletedExamination: IExamination | null = await this.examService.deleteExamination(
        examinationId,
      );
      if (!deletedExamination) {
        throw new HttpException(404, 'Examination not found');
      }
      res.json({ data: deletedExamination });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public calculateScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examId, studentId } = req.params;
      const { answers } = req.body;

      if (!examId || !studentId || !answers || !Array.isArray(answers) || answers.length === 0) {
        throw new HttpException(400, 'Invalid request body');
      }

      const result = await this.examService.calculateScore(examId, studentId, answers);
      new Created({
        message: 'Score calculated successfully',
        data: result,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.params;
      const { examinationId } = req.params;
      if (!studentId) {
        throw new HttpException(401, 'No Student ID');
      }
      const getResult = await this.examService.getScore(studentId, examinationId);
      new OK({
        message: 'Get Score for Student Succesfully',
        data: getResult,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
}
