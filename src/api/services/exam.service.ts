import { HttpException } from '@/exceptions/httpException';
import {
  IExam,
  IExamination,
  IQuestion,
  studentAddToExamination,
} from '@/interfaces/exam.interface';
import { ExaminationModel, ExamModel, QuestionModel, ResultModel } from '@/models/exam.model';

import { Service } from 'typedi';

@Service()
export class ExamService {
  public async getAllQuestions() {
    try {
      const questions = await QuestionModel.find({});
      return questions;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async createQuestion(data: IQuestion) {
    try {
      const createQuestion = await QuestionModel.create(data);
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
      const exam = await ExamModel.findById(_id).populate('questions');
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
      const createExam = await ExamModel.create(data);
      return createExam;
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
      const examinations = await ExaminationModel.find({});
      return examinations;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async getExaminationsByStudent(studentId: string): Promise<IExamination[]> {
    try {
      const examinations = await ExaminationModel.find({ studentId });
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
  public async createExamination(data: IExamination) {
    try {
      const questions = await QuestionModel.find({ _id: { $in: data.question_id } });
      if (questions.length !== data.question_id.length) {
        throw new HttpException(404, 'One or more questions not found');
      }
      const totalScore = questions.reduce((sum, question) => sum + question.points, 0);
      const newData = { ...data, total_score: totalScore };
      const newExamination = await ExaminationModel.create(newData);
      return newExamination;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async addStudentToExamination(examinationId: string, data: studentAddToExamination) {
    try {
      const { student_ids, class_ids } = data;
      if (!student_ids || !class_ids)
        throw new HttpException(400, 'Student ID or Class ID is required');
      if (student_ids) {
        const examination = await ExaminationModel.findById(examinationId);
        if (!examination) throw new HttpException(404, 'Examination not found');
        examination.student_id.push(...student_ids);
      }
      if (class_ids) {
        const examination = await ExaminationModel.findById(examinationId);
        if (!examination) throw new HttpException(404, 'Examination not found');
        examination.class_id.push(...class_ids);
      }
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

  public async deleteExamination(examinationId: string): Promise<IExamination | null> {
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
        examId,
        studentId,
      });
      if (!examination) {
        throw new HttpException(404, 'Examination not found');
      }

      // Lấy danh sách câu hỏi của bài thi từ question collection
      const questions = await QuestionModel.find({ _id: { $in: examination.question_id } });
      if (questions.length !== examination.question_id.length) {
        throw new HttpException(404, 'One or more questions not found');
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
        examination_id: examination._id,
        student_id: studentId,
        score: totalScore,
      });
      // Xóa studentId khỏi examination
      examination.student_id = examination.student_id.filter(id => id !== studentId);
      return result;
    } catch (error) {
      const statusCode = error instanceof HttpException ? error.status : 500;
      const message = error instanceof HttpException ? error.message : 'Internal server error';
      throw new HttpException(statusCode, message);
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
