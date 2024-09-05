import { HttpException } from '@/exceptions/HttpException';
import { BehaviorRes } from '@/interfaces/exam.interface';
import { ExaminationModel, ExamModel, ResultModel, SubjectModel } from '@/models/exam.model';
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

  public async getAllLoginHistories(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const loginHistories = await LoginLogsModel.find()
        .sort({ login_time: -1 })
        .skip(skip)
        .limit(limit);

      const total = await LoginLogsModel.countDocuments();

      return {
        loginHistories,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      };
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }

  public async systemStatistics() {
    try {
      const totalUsers = await UserModel.countDocuments();
      const totalStudents = await UserModel.countDocuments({ role: 'student' });
      const totalTeachers = await UserModel.countDocuments({ role: 'teacher' });
      const averageScore = await ResultModel.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$score' },
          },
        },
      ]);

      // Extract the average score from the result
      const avgScore = averageScore.length > 0 ? averageScore[0].averageScore : null;
      return {
        totalUsers,
        totalStudents,
        totalTeachers,
        avgScore,
      };
    } catch (error) {
      throw new HttpException(500, 'Internal server error');
    }
  }

  public async searchSystemStatistics(search: string) {
    try {
      const numericSearch = parseInt(search);
      const isNumeric = !isNaN(numericSearch);

      // Parse the search string as an ISO date
      const dateSearch = new Date(search);
      const isValidDate = !isNaN(dateSearch.getTime());

      const matchConditions: any[] = [
        { user_name: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];

      if (isValidDate) {
        matchConditions.push({
          date: {
            $gte: dateSearch,
            $lt: new Date(dateSearch.getTime() + 24 * 60 * 60 * 1000), // Next day
          },
        });
      }

      if (isNumeric) {
        matchConditions.push({
          $or: [
            { $expr: { $eq: [{ $year: '$date' }, numericSearch] } },
            { $expr: { $eq: [{ $month: '$date' }, numericSearch] } },
            { $expr: { $eq: [{ $dayOfMonth: '$date' }, numericSearch] } },
          ],
        });
      }

      matchConditions.push({
        date: {
          $regex: search,
          $options: 'i',
        },
      });

      const result = await LoginLogsModel.aggregate([
        {
          $match: {
            $or: matchConditions,
          },
        },
        {
          $sort: { date: -1 }, // Sort by date in descending order
        },
      ]);

      return result;
    } catch (error) {
      console.error('Error in searchSystemStatistics:', error);
      throw new HttpException(500, 'Internal server error');
    }
  }
}
