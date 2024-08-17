import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { IUser, User, UserRegister, UserUpdate } from '@interfaces/users.interface';
import { ClassModel, DepartmentModel, LoginLogsModel, UserModel } from '@models/users.model';
import { generateTokens } from '@/auth/authUtils';
import { now } from 'mongoose';

@Service()
export class UserService {
  public async login(data: IUser): Promise<any> {
    try {
      const { username, password } = data;
      const findUser = await UserModel.findOne({ username: username });
      if (!findUser) throw new Error('User not found');
      const comparePassword = await compare(password, findUser.password);
      if (!comparePassword) throw new Error('Password not matching');
      const { refreshToken, accessToken } = await generateTokens({
        _userId: findUser._id,
        _role: findUser.role,
      });
      const Username = findUser.username;
      const role = findUser.role;
      const logs = await new LoginLogsModel({
        user_id: findUser._id,
        login_time: Date.now(),
      });
      logs.save();

      return { Username, role, refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async register(data: UserRegister): Promise<any> {
    try {
      const { username, password, email, role, class_ids, department_id } = data;
      console.log('data', data);
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const findDepartment = await DepartmentModel.findOne({ _id: department_id });
      if (!findDepartment) throw new Error('Department not found');
      const findClass = await ClassModel.findOne({ _id: class_ids });
      if (!findClass) throw new Error('Class not found');
      const findDuplicateEmail = await UserModel.findOne({ email });
      if (findDuplicateEmail) throw new Error('Email already exists');
      console.log('password', password);
      const hashedPassword = await hash(password, 10);
      if (role !== 'student' && role !== 'teacher')
        throw new Error('Role must be student or teacher');
      data.password = hashedPassword;
      const newUser = new UserModel({
        ...data,
      });
      newUser.save();
      const { refreshToken, accessToken } = await generateTokens({
        _userId: newUser._id,
        _role: newUser.role,
      });
      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async deleteUser(userId: string): Promise<any> {
    try {
      const findUser = await UserModel.findByIdAndDelete(userId);
      if (!findUser) throw new Error('User not found');
      return findUser;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getAllStudents(): Promise<any> {
    try {
      const students = await UserModel.find({ role: 'student' });
      return students;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getAllTeachers(): Promise<any> {
    try {
      const teachers = await UserModel.find({ role: 'teacher' });
      return teachers;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async updateUser(userId: string, data: UserUpdate): Promise<any> {
    try {
      console.log('data', data);
      const findUser = await UserModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: data,
        },
        { new: true },
      );
      console.log('findUser', findUser);
      if (!findUser) throw new Error('User not found');
      return findUser;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getStudentById(userId: string): Promise<any> {
    try {
      const findStudent = await UserModel.findOne({ _id: userId, role: 'student' });
      if (!findStudent) throw new Error('Student not found');
      return findStudent;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getTeacherById(userId: string): Promise<any> {
    try {
      const findTeacher = await UserModel.findOne({ _id: userId, role: 'teacher' });
      if (!findTeacher) throw new Error('Teacher not found');
      return findTeacher;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
}
