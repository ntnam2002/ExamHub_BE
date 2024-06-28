import { IAdmin } from '@/interfaces/users.interface';
import { AdminModel, ClassModel, DepartmentModel } from '@/models/users.model';
import { Service } from 'typedi';
import { compare, hash } from 'bcrypt';
import { generateTokens } from '@/auth/authUtils';
import { HttpException } from '@/helpers/exceptions/httpException';
import { IClass, IDepartment } from '@/interfaces/admin.interface';

@Service()
export class AdminService {
  public async loginAdmin(data: IAdmin): Promise<any> {
    try {
      const { username, password } = data;
      console.log('data', data);
      console.log('username', username);
      const findAdmin = await AdminModel.findOne({ username: username });
      console.log('findAdmin', findAdmin);
      if (!findAdmin) throw new Error('Admin not found');
      const comparePassword = await compare(password, findAdmin.password);
      if (!comparePassword) throw new Error('Password not matching');
      const { refreshToken, accessToken } = await generateTokens({
        _userId: findAdmin._id,
        _role: findAdmin.role,
      });
      const usernameAdmin = findAdmin.username;
      console.log('usernameAdmin', usernameAdmin);
      const role = findAdmin.role;
      return { usernameAdmin, role, refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async registerAdmin(data: IAdmin): Promise<any> {
    try {
      const { username, password } = data;
      const existingAdmin = await AdminModel.findOne({ username });
      if (existingAdmin) {
        throw new Error('Admin already exists');
      }
      const hashedPassword = await hash(password, 10);
      data.password = hashedPassword;
      const newAdmin = new AdminModel({
        ...data,
        role: 'admin',
      });

      await newAdmin.save();
      const { refreshToken, accessToken } = await generateTokens({
        _userId: newAdmin._id,
        _role: newAdmin.role,
      });
      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getAdmin(): Promise<any> {
    try {
      const findAdmin = await AdminModel.find({}).select('-password');
      if (!findAdmin) throw new Error('Admin not found');
      return findAdmin;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getAdminByName(username: string): Promise<any> {
    try {
      const findAdmin = await AdminModel.findOne({ username }).select('-password');
      if (!findAdmin) throw new Error('Admin not found');
      return findAdmin;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async updatePasswordAdmin(data: IAdmin): Promise<any> {
    try {
      const { username, password } = data;
      const findAdmin = await AdminModel.findOne({ username });
      if (!findAdmin) throw new Error('Admin not found');
      const hashedPassword = await hash(password, 10);
      findAdmin.password = hashedPassword;
      await findAdmin.save();
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async deleteAdmin(username: string): Promise<any> {
    try {
      const findAdmin = await AdminModel.findOneAndDelete({ username });
      if (!findAdmin) throw new Error('Admin not found');
      return findAdmin;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getAllClass(): Promise<any> {
    try {
      const findClass = await ClassModel.find({});
      if (!findClass) throw new Error('Class not found');
      return findClass;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async addClass(className: string) {
    try {
      const findClass = await ClassModel.findOne({ className });
      if (findClass) throw new Error('Class already exists');
      const newClass = new ClassModel({
        class_name: className,
      });
      await newClass.save();
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async deleteClass(classId: string) {
    try {
      const findClass = await ClassModel.findOneAndDelete({ classId });
      if (!findClass) throw new Error('Class not found');
      return findClass;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async updateClass(classId: string, data: IClass) {
    try {
      const { class_name, teacherId, student_ids } = data;
      const updatedClass = await ClassModel.findOneAndUpdate(
        { classId },
        { $set: { class_name, teacherId, student_ids } },
        { new: true },
      );

      if (!updatedClass) throw new Error('Class not found');

      return updatedClass;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async searchClass(data: IClass): Promise<any> {
    try {
      const { class_name, teacherId, student_ids } = data;
      const query: any = {};

      if (class_name) {
        query.class_name = { $regex: class_name, $options: 'i' };
      }

      if (teacherId) {
        query.teacherId = teacherId;
      }

      if (student_ids && student_ids.length > 0) {
        query.student_ids = { $in: student_ids };
      }

      const classes =
        Object.keys(query).length === 0 ? await ClassModel.find() : await ClassModel.find(query);
      if (!classes.length) throw new Error('Class not found');
      return classes;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }
  public async addStudentToClass(classId: string, studentId: string) {
    try {
      const findClass = await ClassModel.findOne({ classId });
      if (!findClass) throw new Error('Class not found');
      findClass.student_ids.push(studentId);
      await findClass.save();
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getAllDepartment() {
    try {
      const departments = await DepartmentModel.find({});
      if (!departments) throw new Error('Department not found');
      return departments;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async addDepartment(department_name: string) {
    try {
      const findDepartment = await DepartmentModel.findOne({ department_name });
      if (findDepartment) throw new Error('Department already exists');
      const newDepartment = new DepartmentModel({
        department_name,
      });
      await newDepartment.save();
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async deleteDepartment(departmentId: string) {
    try {
      const findDepartment = await DepartmentModel.findOneAndDelete({ departmentId });
      if (!findDepartment) throw new Error('Department not found');
      return findDepartment;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async updateDepartment(departmentId: string, data: IDepartment) {
    try {
      const { department_name, teacher_ids, class_ids } = data;
      const query: any = {};

      if (department_name) {
        query.department_name = { $regex: department_name, $options: 'i' };
      }

      if (teacher_ids) {
        query.teacher_ids = teacher_ids;
      }

      if (class_ids) {
        query.class_ids = class_ids;
      }
      const updatedDepartment = await DepartmentModel.findOneAndUpdate({ query });
      if (!updatedDepartment) throw new Error('Department not found');
      return updatedDepartment;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
}
