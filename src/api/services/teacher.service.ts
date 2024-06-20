import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { log } from 'console';
import { generateTokens } from '@/auth/authUtils';

@Service()
export class TeacherService {
  public async loginTeacher(data: User): Promise<any> {
    const { username, password } = data;
    try {
      const findUser = await UserModel.findOne({ username });
      if (!findUser) throw new Error('User not found');
      const comparePassword = await hash(password, 10);
      if (!comparePassword) throw new Error('Password not matching');
      const { refreshToken, accessToken } = await generateTokens({
        _userId: findUser._id,
        _role: findUser.role,
      });
      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async registerTeacher(data: User): Promise<any> {
    try {
      const { username, password } = data;
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await hash(password, 10);
      data.password = hashedPassword;
      const newUser = new UserModel({
        ...data,
        role: 'teacher',
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
}
