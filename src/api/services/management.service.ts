import { HttpException } from '@/exceptions/HttpException';
import { ExaminationModel, ExamModel, SubjectModel } from '@/models/exam.model';
import { BehaviorModel } from '@/models/studentBehavior.model';
import { AcademicYearModel, LoginLogsModel, UserModel } from '@/models/users.model';
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

  public async getAllBehaviorHistories() {
    try {
      // Fetch all behavior histories
      const behaviorHistories = await BehaviorModel.find();

      // Extract student IDs and examination IDs from behavior histories
      const studentIds = behaviorHistories.map((history: any) => history.studentId);
      const examinationIds = behaviorHistories.map((history: any) => history.examinationId);

      // Fetch student details based on student IDs
      const students = await UserModel.find({ _id: { $in: studentIds } }, 'name');

      // Fetch examination details based on examination IDs
      const examinations = await ExaminationModel.find({ _id: { $in: examinationIds } }, 'exam_id');

      // Extract exam IDs from examinations
      const examIds = examinations.map((exam: any) => exam.exam_id);

      // Fetch exam names based on exam IDs
      const exams = await ExamModel.find({ _id: { $in: examIds } }, 'exam_name');

      // Create maps for student, examination, and exam details
      const studentMap = new Map(students.map((student: any) => [student._id.toString(), student]));
      const examinationMap = new Map(examinations.map((exam: any) => [exam._id.toString(), exam]));
      const examMap = new Map(exams.map((exam: any) => [exam._id.toString(), exam]));

      // Combine student and examination details with behavior histories
      const result = behaviorHistories.map((history: any) => {
        const examination = examinationMap.get(history.examinationId.toString());
        const examName = examMap.get(examination?.exam_id.toString())?.exam_name;
        return {
          _id: history._id,
          behavior: history.behavior,
          date: history.date,
          studentName: studentMap.get(history.studentId.toString())?.name,
          examinationName: examName,
        };
      });

      // Return the combined data
      return result;
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

  public async getAllLoginHistories() {
    try {
      const loginHistories = await LoginLogsModel.find().sort({ date: -1 });
      return loginHistories;
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }
}
