import { Document, model, Schema } from 'mongoose';
import { Exam, Result } from '../interfaces/exam.interface';
const QuestionAnswerSchema: Schema = new Schema({
  questionAnswerId: { type: Schema.Types.ObjectId, required: true, unique: true },
  questionAnswerContent: { type: String, required: true },
});
const QuestionSchema: Schema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true, unique: true },
  questionContent: { type: String, required: true },
  questionType: { type: String, required: true },
  questionAnswers: [QuestionAnswerSchema],
  questionCorrectAnswer: { type: String, required: true },
});
const ExamSchema: Schema = new Schema({
  examId: { type: Schema.Types.ObjectId, required: true, unique: true },
  examName: { type: String, required: true },
  examType: { type: String, required: true },
  examDate: { type: Date, required: true },
  examDuration: { type: Number, required: true },
  examApproved: { type: String, required: true },
  examQuestions: [QuestionSchema],
  CreatedAt: { type: Date, required: true },
});

const ResultSchema: Schema = new Schema({
  resultId: { type: Schema.Types.ObjectId, required: true, unique: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, required: true, default: Date.now },
});

export const ResultModel = model<Result & Document>('Result', ResultSchema);
export const ExamModel = model<Exam & Document>('Exam', ExamSchema);
