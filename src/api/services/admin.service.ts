import { IAdmin } from '@/interfaces/users.interface';
import { AdminModel } from '@/models/users.model';
import { Service } from 'typedi';
import { compare, hash } from 'bcrypt';
import { generateTokens } from '@/auth/authUtils';
import { HttpException } from '@/helpers/exceptions/httpException';

@Service()
export class AdminService {
  public async loginAdmin(data: IAdmin): Promise<any> {
    const { username, password } = data;
    try {
      const findAdmin = await AdminModel.findOne({ username });
      if (!findAdmin) throw new Error('Admin not found');
      const comparePassword = await compare(password, findAdmin.password);
      if (!comparePassword) throw new Error('Password not matching');
      const { refreshToken, accessToken } = await generateTokens({
        _userId: findAdmin._id,
        _role: findAdmin.role,
      });
      return { refreshToken, accessToken };
    } catch (error) {
      throw error;
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
}
