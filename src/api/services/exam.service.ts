import { HttpException } from '@/exceptions/HttpException';
import {
  IExam,
  IExamination,
  IQuestion,
  studentAddToExamination,
} from '@/interfaces/exam.interface';
import {
  DifficultyModel,
  ExaminationModel,
  ExamModel,
  QuestionModel,
  ResultModel,
  SubjectModel,
} from '@/models/exam.model';
import { ClassModel } from '@/models/users.model';

import { Service } from 'typedi';

@Service()
export class ExamService {
  public async getAllQuestions(page, limit) {
    try {
      // const totalQuestions = await QuestionModel.countDocuments();
      // const totalPages = Math.ceil(totalQuestions / limit);
      const questions = await QuestionModel.find({});

      return questions;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async createQuestion(data: IQuestion) {
    try {
      const existingQuestion = await QuestionModel.findOne({
        text: data.text,
      });
      if (existingQuestion) {
        throw new HttpException(400, 'Question already exists');
      }
      const findDifficulty = await DifficultyModel.findOne({ id: data.difficulty });
      if (!findDifficulty) {
        throw new HttpException(400, 'Difficulty level not found');
      }
      const difficultyLevel = findDifficulty.level;
      const findSubject = await SubjectModel.findOne({ _id: data.subject_id });
      const subjectname = findSubject.subject_name;
      const newData = {
        ...data,
        subject_name: subjectname,
        difficulty: difficultyLevel,
      };
      const createQuestion = await QuestionModel.create(newData);
      return createQuestion;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getQuestionById(_id: string) {
    try {
      const question = await QuestionModel.findById(_id);
      if (!question) throw new HttpException(404, 'Question not found');
      return question;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async updateQuestion(_id: string, data: IQuestion) {
    try {
      const updateQuestion = await QuestionModel.findByIdAndUpdate(
        _id,
        { $set: data },
        { new: true },
      );
      if (!updateQuestion) throw new HttpException(404, 'Question not found');
      return updateQuestion;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async deleteQuestion(_id: string) {
    try {
      const deleteQuestion = await QuestionModel.findByIdAndDelete(_id);
      if (!deleteQuestion) throw new HttpException(404, 'Question not found');
      return deleteQuestion;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExams(): Promise<any> {
    try {
      const exams = await ExamModel.find({}).populate('questions');
      if (!exams.length) throw new HttpException(404, 'Exams not found');
      return exams;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExamById(_id: string): Promise<any> {
    try {
      const exam = await ExamModel.findOne({ _id }).populate('questions');
      if (!exam) throw new HttpException(404, 'Exam not found');
      return exam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExamForStudent(studentId: string): Promise<any> {
    try {
      const exams = await ExamModel.find({ students: studentId }).populate('questions');
      if (!exams.length) throw new HttpException(404, 'Exams not found');
      return exams;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async createExam(data: IExam): Promise<any> {
    try {
      const existingExam = await ExamModel.findOne({
        exam_name: data.exam_name,
      });
      if (existingExam) {
        throw new HttpException(400, 'Exam already exists');
      }
      if (data.questions.length === 0) {
        const getRandQuestions = await QuestionModel.aggregate([
          { $sample: { size: 5 } },
          { $project: { _id: 1 } },
        ]);
        data.questions = getRandQuestions.map(question => question._id);
        await ExamModel.create(data);
      } else {
        await ExamModel.create(data);
      }
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async updateExam(_id: string, data: IExam): Promise<any> {
    try {
      const updateExam = await ExamModel.findByIdAndUpdate(_id, { $set: data }, { new: true });
      if (!updateExam) throw new HttpException(404, 'Exam not found');
      return updateExam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async deleteExam(_id: string): Promise<any> {
    try {
      const deleteExam = await ExamModel.findByIdAndDelete(_id);
      if (!deleteExam) throw new HttpException(404, 'Exam not found');
      return deleteExam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async addQuestionToExam(examId: string, questionId: string): Promise<any> {
    try {
      const exam = await ExamModel.findById({ _id: examId });
      if (!exam) throw new HttpException(404, 'Exam not found');
      const question = await QuestionModel.findById(questionId);
      if (!question) throw new HttpException(404, 'Question not found');
      exam.questions.push(question._id);
      await exam.save();
      return exam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async removeQuestionFromExam(examId: string, questionId: string): Promise<any> {
    try {
      const exam: any = await ExamModel.findById(examId);
      if (!exam) throw new HttpException(404, 'Exam not found');
      exam.questions.pull(questionId);
      await exam.save();
      return exam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getExaminations(): Promise<IExamination[]> {
    try {
      const examinations = await ExaminationModel.find({})
        .populate({
          path: 'exam_id',
          select: 'exam_name',
        })
        .populate({
          path: 'class_id',
          select: 'class_name',
        })
        .populate({
          path: 'student_id',
          select: 'username',
        });

      return examinations;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExaminationById(examinationId: string): Promise<IExamination | null> {
    try {
      const examination = await ExaminationModel.findById(examinationId);
      return examination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async addExamToExamination(examinationId: string, examId: string): Promise<any> {
    try {
      const examination = await ExaminationModel.findById(examinationId);
      if (!examination) throw new HttpException(404, 'Examination not found');
      const exam = await ExamModel.findById(examId);
      if (!exam) throw new HttpException(404, 'Exam not found');
      examination.exam_id = exam._id;
      await examination.save();
      return examination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExaminationByStudentId(studentId: string): Promise<any> {
    try {
      const examinations = await ExaminationModel.find({ student_id: studentId }).populate(
        'exam_id',
      );

      return examinations;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExaminationData(examinationId: string): Promise<any> {
    try {
      const examination = await ExaminationModel.find({ _id: examinationId }).select(
        '-access_keys -created_by -started_at -createdAt -updatedAt -__v',
      );

      const populatedExaminations = await Promise.all(
        examination.map(async exam => {
          const examObj = await ExamModel.findById(exam.exam_id);
          const questionIds = examObj.questions;

          const questions = await QuestionModel.find({ _id: { $in: questionIds } });
          return {
            ...exam.toJSON(),
            questions: questions.map(question => question.toJSON()),
          };
        }),
      );
      return populatedExaminations;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async createExamination(_idUser: string, data: IExamination) {
    try {
      // Find the exam by exam_id
      const findExam = await ExamModel.findById(data.exam_id);
      if (!findExam) {
        throw new HttpException(404, 'Exam not found');
      }

      // Find the questions associated with the exam
      const questions = await QuestionModel.find({ _id: { $in: findExam.questions } });
      if (!questions || questions.length === 0) {
        throw new HttpException(404, 'One or more questions not found');
      }

      // Find the class by class_id
      const findStudentInClass = await ClassModel.findById(data.class_id);
      if (!findStudentInClass) {
        throw new HttpException(404, 'Class not found');
      }

      // Calculate the total score of the exam
      const totalScore = questions.reduce((sum, question) => sum + question.points, 0);

      // Get all students from the class
      const classStudentIds = findStudentInClass.student_ids || [];

      // Merge provided student IDs with class student IDs, ensuring no duplicates
      const providedStudentIds = data.student_id || [];
      const mergedStudentIds = Array.from(new Set([...classStudentIds, ...providedStudentIds]));

      // Prepare the new examination data
      const newData = {
        ...data,
        total_score: totalScore,
        student_id: mergedStudentIds,
      };

      // Create the new examination
      const newExamination = await ExaminationModel.create(newData);
      return newExamination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async addStudentToExamination(examinationId: string, data: studentAddToExamination) {
    try {
      const { student_ids, class_ids } = data;

      // Fetch the examination by ID
      const examination = await ExaminationModel.findById(examinationId);

      if (!examination) {
        throw new HttpException(404, 'Examination not found');
      }

      // Add student IDs to the examination
      if (student_ids) {
        examination.student_id.push(...student_ids);
      }

      // Add class to the examination
      if (class_ids) {
        const findClass = await ClassModel.find({ _id: class_ids });
        if (!findClass) {
          throw new HttpException(404, 'Class not found');
        }
        examination.class_id.push(...class_ids);
      }

      // Save the updated examination
      await examination.save();
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async updateExamination(
    examinationId: string,
    data: Partial<IExamination>,
  ): Promise<IExamination | null> {
    try {
      const updatedExamination = await ExaminationModel.findByIdAndUpdate(
        examinationId,
        { $set: data },
        { new: true },
      );
      return updatedExamination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async deleteExamination(examinationId: string) {
    try {
      const deletedExamination = await ExaminationModel.findByIdAndDelete(examinationId);
      return deletedExamination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async calculateScore(examId: string, studentId: string, answers: any[]) {
    try {
      // Tìm kiếm thông tin của bài thi trong examination collection
      const examination = await ExaminationModel.findOne({
        _id: examId,
        student_id: studentId,
      });

      if (!examination) {
        throw new HttpException(404, 'Examination not found');
      }

      // Lấy danh sách câu hỏi của bài thi từ question collection
      const examIdformExamination = examination.exam_id;
      const findQuestionByExamId = await ExamModel.findById(examIdformExamination);
      const questions = await QuestionModel.find({
        _id: { $in: findQuestionByExamId.questions },
      });

      if (!questions) {
        throw new HttpException(404, 'Questions not found');
      }

      // Tính toán điểm số
      let totalScore = 0;

      for (const answer of answers) {
        const questionId = answer.questionId;
        const selectedOptionId = answer.selectedOptionId;

        // Tìm câu hỏi trong danh sách câu hỏi của bài thi
        const question = questions.find(q => q._id.toString() === questionId);

        if (!question) {
          throw new HttpException(404, `Question with ID ${questionId} not found in examination`);
        }

        // Nếu không có selectedOptionId, bỏ qua câu hỏi này
        if (!selectedOptionId) {
          continue;
        }

        // Tìm đáp án được chọn
        const selectedOption = question.options.find(
          option => option._id.toString() === selectedOptionId,
        );
        if (!selectedOption) {
          throw new HttpException(
            400,
            `Selected option with ID ${selectedOptionId} not found for question ${questionId}`,
          );
        }

        // Cộng điểm nếu câu trả lời đúng
        if (selectedOption.is_correct) {
          totalScore += question.points;
        }
      }
      // Lưu điểm vào cơ sở dữ liệu
      const result = await ResultModel.create({
        examination_id: findQuestionByExamId.exam_name,
        student_id: studentId,
        score: totalScore,
      });

      // Xóa studentId khỏi examination
      examination.student_id = examination.student_id.filter(id => id !== studentId);
      await examination.save();

      return result;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getScore(studentId: string, examinationId: string) {
    try {
      const results = await ResultModel.find({
        student_id: studentId,
        examination_id: examinationId,
      });
      if (!results.length) throw new HttpException(404, 'Results not found');
      return results;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
}
