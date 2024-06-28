import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { IAdmin, User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { log } from 'console';
import { generateTokens } from '@/auth/authUtils';

@Service()
export class UserService {
  public async login(data: IAdmin): Promise<any> {
    try {
      const { username, password } = data;
      const findUser = await UserModel.findOne({ username: username });
      if (!findUser) throw new Error('Admin not found');
      const comparePassword = await compare(password, findUser.password);
      if (!comparePassword) throw new Error('Password not matching');
      const { refreshToken, accessToken } = await generateTokens({
        _userId: findUser._id,
        _role: findUser.role,
      });
      const Username = findUser.username;
      const role = findUser.role;
      return { Username, role, refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async register(data: User): Promise<any> {
    try {
      const { username, password, email, role, class_ids, department_id } = data;
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await hash(password, 10);
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
  public async updateUser(userId: string, data: User): Promise<any> {
    try {
      const findUser = await UserModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: data,
        },
        { new: true },
      );

      if (!findUser) throw new Error('User not found');
      return findUser;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
}
