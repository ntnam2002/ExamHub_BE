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
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  difficuty: { type: mongoose.Schema.Types.ObjectId, ref: 'Difficulty' },
  created_at: { type: Date, default: Date.now },
});
const subjectSchema = new Schema({
  subject_name: { type: String },
  specializtion: { type: String },
  created_at: { type: Date, default: Date.now },
});

const difficultySchema = new Schema({
  level: { type: String },
  description: { type: String },
});
// Exam Schema
const examSchema = new Schema(
  {
    exam_name: { type: String },
    description: { type: String },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
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
    //question_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    class_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    access_keys: { type: String },
    started_at: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total_score: { type: Number },
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

const studentStatisticsSchema = new Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_exams: { type: Number },
  total_score: { type: Number },
  average_score: { type: Number },
  highest_score: { type: Number },
  lowest_score: { type: Number },
});

const teacherStatisticsSchema = new Schema({
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_exams_created: { type: Number },
  total_students_taught: { type: Number },
  average_student_score: { type: Number },
});

export const ExaminationModel = model<Examination & Document>('Examination', examinationSchema);
export const ResultModel = model<Result & Document>('Result', resultSchema);
export const QuestionModel = model<Question & Document>('Question', questionSchema);
export const ExamModel = model<Exam & Document>('Exam', examSchema);

export const TeacherStatisticsModel = model('TeacherStatistics', teacherStatisticsSchema);
export const StudentStatisticsModel = model('StudentStatistics', studentStatisticsSchema);
export const DifficultyModel = model('Difficulty', difficultySchema);
export const SubjectModel = model('Subject', subjectSchema);
