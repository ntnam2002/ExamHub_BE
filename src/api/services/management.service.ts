import { HttpException } from '@/exceptions/HttpException';
import { ExaminationModel, SubjectModel } from '@/models/exam.model';
import { BehaviorModel } from '@/models/studentBehavior.model';
import { AcademicYearModel, UserModel } from '@/models/users.model';
import { Service } from 'typedi';

@Service()
export class ManagementService {
  public async getAllSubjects() {
    try {
      const subjects = await SubjectModel.find();
      return subjects;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async getSubjectById(subjectId: string) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      return subject;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async createSubject(subjectData) {
    try {
      const subject = await SubjectModel.create(subjectData);
      return subject;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async updateSubject(subjectId: string, subjectData) {
    try {
      const subject = await SubjectModel.findByIdAndUpdate(subjectId, subjectData, { new: true });
      return subject;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async getAllAcademicYear() {
    try {
      const academicYears = await AcademicYearModel.find();
      return academicYears;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async deleteSubject(subjectId: string) {
    try {
      const subject = await SubjectModel.findByIdAndDelete(subjectId);
      return subject;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
  public async manageStudentBehavior(examinationId: string, studentId: string, behavior: string) {
    try {
      const examination = await ExaminationModel.findById(examinationId);
      if (!examination) {
        throw new HttpException(404, 'Examination not found');
      }
      const student = await UserModel.findById(studentId);
      if (!student) {
        throw new HttpException(404, 'Student not found');
      }

      const createBehaviorHistory = new BehaviorModel({
        examinationId: examinationId,
        studentId: studentId,
        behavior,
        date: Date.now(),
      });
      await createBehaviorHistory.save();
    } catch (error) {
      throw new HttpException(400, error);
    }
  }
}
