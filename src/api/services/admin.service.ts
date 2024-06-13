import { Service } from 'typedi';

@Service()
export class AdminService {
  public async loginAdmin(): Promise<void> {
    // Implement login admin
    const findAdmin = await AdminModel.findOne({ email: adminData.email });
  }
}
