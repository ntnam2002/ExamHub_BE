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
  public getAllSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.management.getAllSubjects();
      new OK({
        message: 'Get subject success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.management.getSubjectById(id);
      new OK({
        message: 'Get subject success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subjectData = req.body;
      const result = await this.management.createSubject(subjectData);
      new Created({
        message: 'Create subject success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public updateSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const subjectData = req.body;
      const result = await this.management.updateSubject(id, subjectData);
      new OK({
        message: 'Update subject success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.management.deleteSubject(id);
      new OK({
        message: 'Delete subject success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public getAllAcademicYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.management.getAllAcademicYear();
      new OK({
        message: 'Get academic year success',
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
