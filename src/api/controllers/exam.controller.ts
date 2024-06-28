import Container from 'typedi';
import { ExamService } from '../services/exam.service';
import { NextFunction, Request, Response } from 'express';
import { OK } from '@/helpers/valid_responses/success.response';
import { HttpException } from '@/exceptions/httpException';

export class ExamController {
  public exam = Container.get(ExamService);
  public async getExam(req: Request, res: Response, next: NextFunction) {
    try {
      const getExam = await this.exam.getExam();
      new OK({
        message: 'Get exam success',
        data: getExam,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }
}
