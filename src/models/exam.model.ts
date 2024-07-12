import { Exam, Question, Result, Examination } from '@/interfaces/exam.interface';
import mongoose, { Document, model, Schema } from 'mongoose';

// Option Schema
const optionSchema = new Schema({
  text: { type: String },
  is_correct: { type: Boolean, default: false },
});

// Question Schema
const questionSchema = new Schema({
  text: { type: String },
  points: { type: Number, default: 1 },
  options: { type: [optionSchema] },
  created_at: { type: Date, default: Date.now },
});

// Exam Schema
const examSchema = new Schema(
  {
    exam_name: { type: String },
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    duration_minutes: { type: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// Examination Schema
const examinationSchema = new Schema(
  {
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    question_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    class_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    access_keys: { type: String },
    started_at: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

// Result Schema
const resultSchema = new Schema(
  {
    examination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination' },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ExaminationModel = model<Examination & Document>('Examination', examinationSchema);
export const ResultModel = model<Result & Document>('Result', resultSchema);
export const QuestionModel = model<Question & Document>('Question', questionSchema);
export const ExamModel = model<Exam & Document>('Exam', examSchema);
