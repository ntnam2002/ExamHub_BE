import { Exam, Question, Result } from '@/interfaces/exam.interface';
import { Document, model, Schema } from 'mongoose';

const examSchema = new Schema({
  exam_name: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      points: { type: Number, required: true },
    },
  ],
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  class_ids: [{ type: Schema.Types.ObjectId, ref: 'Class', required: true }],
  scheduled_date: { type: Date, required: true },
  duration_minutes: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const questionSchema = new Schema({
  text: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      is_correct: { type: Boolean, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const resultSchema = new Schema({
  exam_id: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  submitted_at: { type: Date, default: Date.now },
});

export const ResultModel = model<Result & Document>('Results', resultSchema);
export const QuestionModel = model<Question & Document>('Questions', questionSchema);
export const ExamModel = model<Exam & Document>('Exams', examSchema);
