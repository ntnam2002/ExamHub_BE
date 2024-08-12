import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { OK, Created } from '@/helpers/valid_responses/success.response';
import { Container } from 'typedi';

import { ManagementService } from '../services/management.service';

export class ManagemnentController {
  public management = Container.get(ManagementService);

  public managementStudentBehavior = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examinationId, studentId, behavior } = req.body;
      const managementData = await this.management.manageStudentBehavior(
        examinationId,
        studentId,
        behavior,
      );
      res.status(200).json({ data: managementData, message: 'save manageStudentBehavior' });
    } catch (error) {
      next(error);
    }
  };
}
