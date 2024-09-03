import { HttpException } from '@/exceptions/HttpException';
import { BehaviorRes } from '@/interfaces/exam.interface';
import { ExaminationModel, ExamModel, SubjectModel } from '@/models/exam.model';
import { BehaviorModel } from '@/models/studentBehavior.model';
import { AcademicYearModel, LoginLogsModel, UserModel } from '@/models/users.model';
import e from 'express';
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

  public async getAllBehaviorHistories(): Promise<BehaviorRes[]> {
    try {
      const result = await BehaviorModel.find().sort({ date: -1 });

      const behaviorHistories = result.map(item => ({
        student_name: item.student_name,
        examination_name: item.examination_name,
        behavior: item.behavior,
        date: item.date,
      }));
      return behaviorHistories;
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
      const exam_id = examination.exam_id;
      const exam = await ExamModel.findById(exam_id);
      if (!exam) {
        throw new HttpException(404, 'Exam not found');
      }
      const examination_name = exam.exam_name;
      const student = await UserModel.findById(studentId);
      if (!student) {
        throw new HttpException(404, 'Student not found');
      }
      const student_name = student.name;

      const createBehaviorHistory = new BehaviorModel({
        examination_name: examination_name,
        student_name: student_name,
        behavior,
        date: Date.now(),
      });
      await createBehaviorHistory.save();
    } catch (error) {
      throw new HttpException(400, error);
    }
  }
  public async findStudentBehavior(search: string) {
    try {
      const numericSearch = parseInt(search);
      const isNumeric = !isNaN(numericSearch);

      // Parse the search string as an ISO date
      const dateSearch = new Date(search);
      const isValidDate = !isNaN(dateSearch.getTime());

      const result = await BehaviorModel.aggregate([
        {
          $match: {
            $or: [
              { student_name: { $regex: search, $options: 'i' } },
              { examination_name: { $regex: search, $options: 'i' } },
              { behavior: { $regex: search, $options: 'i' } },
              // Exact ISO date match
              isValidDate
                ? {
                    date: {
                      $gte: dateSearch,
                      $lt: new Date(dateSearch.getTime() + 24 * 60 * 60 * 1000), // Next day
                    },
                  }
                : {},
              // Partial date match (year, month, or day)
              isNumeric
                ? {
                    $or: [
                      { $expr: { $eq: [{ $year: '$date' }, numericSearch] } },
                      { $expr: { $eq: [{ $month: '$date' }, numericSearch] } },
                      { $expr: { $eq: [{ $dayOfMonth: '$date' }, numericSearch] } },
                    ],
                  }
                : {},
              // Partial string match for date components
              {
                date: {
                  $regex: search,
                  $options: 'i',
                },
              },
            ].filter(condition => Object.keys(condition).length > 0),
          },
        },
        {
          $sort: { date: -1 }, // Sort by date in descending order
        },
      ]);

      return result;
    } catch (error) {
      console.error('Error in findStudentBehavior:', error);
      throw new HttpException(500, 'Internal server error');
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
