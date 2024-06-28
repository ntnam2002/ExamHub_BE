import { Exam, Question, Result } from '@/interfaces/exam.interface';
import mongoose, { Document, model, Schema } from 'mongoose';
import crypto from 'crypto';

// Question Schema
const questionSchema = new Schema({
  text: { type: String },
  points: { type: Number },
  options: [
    {
      text: { type: String },
      is_correct: { type: Boolean },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

// Exam Schema
const examSchema = new Schema(
  {
    exam_name: { type: String },
    description: { type: String },
    questions: [questionSchema],
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    class_ids: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    scheduled_date: { type: Date },
    duration_minutes: { type: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// Examination Schema
const examinationSchema = new Schema(
  {
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    class_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    access_keys: [
      {
        key: { type: String },
        expires_at: { type: Date },
      },
    ],
    started_at: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

// Result Schema
const resultSchema = new Schema(
  {
    examination_id: { type: Schema.Types.ObjectId, ref: 'Examination' },
    exam_id: { type: Schema.Types.ObjectId, ref: 'Exam' },
    student_id: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ExaminationModel = model<Document & { [key: string]: any }>(
  'Examination',
  examinationSchema,
);
export const ResultModel = model<Result & Document>('Result', resultSchema);
export const QuestionModel = model<Question & Document>('Question', questionSchema);
export const ExamModel = model<Exam & Document>('Exam', examSchema);
