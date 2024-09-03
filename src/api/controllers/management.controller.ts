import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { OK, Created } from '@/helpers/valid_responses/success.response';
import { Container } from 'typedi';

import { ManagementService } from '../services/management.service';
import { UserModel } from '@/models/users.model';

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
      new Created({
        message: 'Manage student behavior success',
        data: managementData,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  public getAllBehaviorHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.management.getAllBehaviorHistories();
      new OK({
        message: 'Get behavior history success',
        data: result,
      }).send(res);
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  };

  public searchBehaviorHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query;

      // Check if query is provided
      if (!search || typeof search !== 'string') {
        return res.status(400).json({
          message: 'Query parameter is required and must be a string',
        });
      }

      // Search behavior histories
      const result = await this.management.findStudentBehavior(search);

      // Respond with the search results
      new OK({
        message: 'Search behavior history success',
        data: result,
      }).send(res);
    } catch (error) {
      // Pass error to next middleware
      next(new HttpException(500, error.message || 'Internal server error'));
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

  public getAllLoginLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all login histories
      const loginHistories = await this.management.getAllLoginHistories();

      // Extract user IDs from login histories
      const userIds = loginHistories.map((log: any) => log.user_id);

      // Fetch user details based on user IDs
      const users = await UserModel.find({ _id: { $in: userIds } }, 'username name');

      // Create a map of user details
      const userMap = new Map(users.map((user: any) => [user._id.toString(), user]));

      // Combine user details with login histories
      const result = loginHistories.map((log: any) => ({
        ...log,
        user: userMap.get(log.user_id.toString()), // Use log.user_id instead of log.userId
      }));

      // Map the combined data to include only username, name, and login_time
      const filteredResult = result.map((log: any) => ({
        username: log.user.username,
        name: log.user.name,
        login_time: log._doc.login_time,
      }));

      // Send the response
      new OK({
        message: 'Get login logs success',
        data: filteredResult,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
