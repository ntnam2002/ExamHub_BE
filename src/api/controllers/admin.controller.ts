import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { IAdmin } from '../../interfaces/users.interface';
import { AdminService } from '../services/admin.service';
import { OK } from '../../helpers/valid_responses/success.response';
import { HttpException } from '@/helpers/exceptions/httpException';
import { IClass, IDepartment } from '@/interfaces/admin.interface';
export class AdminController {
  public admin = Container.get(AdminService);
  public loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      console.log(data);
      const login = await this.admin.loginAdmin(data);
      console.log('login', login);
      new OK({
        message: 'Login admin success',
        data: {
          username: login.usernameAdmin,
          authority: login.role,
          accessToken: login.accessToken,
          refreshToken: login.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAdmin = req.body;
      const register = await this.admin.registerAdmin(data);
      new OK({
        message: 'Register admin success',
        data: {
          accessToken: register.accessToken,
          refreshToken: register.refreshToken,
        },
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getAllClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getAllClass = await this.admin.getAllClass();
      new OK({
        message: 'Get all class success',
        data: getAllClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public addClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { className } = req.body;
      console.log(className);
      const addClass = await this.admin.addClass(className);
      new OK({
        message: 'Add class success',
        data: addClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public deleteClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { classId } = req.params;
      console.log(classId);
      const deleteClass = await this.admin.deleteClass(classId);
      new OK({
        message: 'Delete class success',
        data: deleteClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public updateClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { classId } = req.params;
      const data: IClass = req.body;
      const updateClass = await this.admin.updateClass(classId, data);
      new OK({
        message: 'Update class success',
        data: updateClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public searchClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IClass = req.body;
      const searchClass = await this.admin.searchClass(data);
      new OK({
        message: 'Search class success',
        data: searchClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public addStudentToClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { classId, studentId } = req.body;
      const addStudentToClass = await this.admin.addStudentToClass(classId, studentId);
      new OK({
        message: 'Add student to class success',
        data: addStudentToClass,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public getAllDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getAllDepartment = await this.admin.getAllDepartment();
      new OK({
        message: 'Get all department success',
        data: getAllDepartment,
      }).send(res);
    } catch (error) {}
  };
  public addDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { department_name } = req.body;
      const addDepartment = await this.admin.addDepartment(department_name);
      new OK({
        message: 'Add department success',
        data: addDepartment,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.params;
      const deleteDepartment = await this.admin.deleteDepartment(departmentId);
      new OK({
        message: 'Delete department success',
        data: deleteDepartment,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  public updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.params;
      const data: IDepartment = req.body;
      const updateDepartment = await this.admin.updateDepartment(departmentId, data);
      new OK({
        message: 'Update department success',
        data: updateDepartment,
      }).send(res);
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
}
