import { HttpException } from '@/exceptions/httpException';
import { IExam, IQuestion } from '@/interfaces/exam.interface';
import { ExamModel, QuestionModel } from '@/models/exam.model';
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
      const exam = await ExamModel.findById(examId);
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
}
