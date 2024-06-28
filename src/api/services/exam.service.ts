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
  public async getQuestionById(id: string) {
    try {
      const question = await QuestionModel.findById(id);
      return question;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async updateQuestion(id: string, data: IQuestion) {
    try {
      const { text, options } = data;
      const updateQuestion = await QuestionModel.findOneAndUpdate(
        { id },
        { $set: { text, options } },
        { new: true },
      );
      return updateQuestion;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async deleteQuestion(id: string) {
    try {
      const deleteQuestion = await QuestionModel.findByIdAndDelete(id);
      return deleteQuestion;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getExam(): Promise<any> {
    try {
      const findExam = await ExamModel.find({});
      if (!findExam) throw new Error('Exam not found');
      return findExam;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
  public async getExamById(id: string): Promise<any> {
    try {
      const findExam = await ExamModel.findById(id);
      if (!findExam) throw new Error('Exam not found');
      return findExam;
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
}
