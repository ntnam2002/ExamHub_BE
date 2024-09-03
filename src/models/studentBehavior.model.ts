import { StudentBehavior } from '@/interfaces/exam.interface';
import { Document, model, Schema } from 'mongoose';

const StudentBehavior = new Schema({
  student_name: { type: String, required: true },
  examination_name: { type: String, required: true },
  behavior: { type: String, required: true },
  date: { type: Date, required: true },
  //comment: { type: String, required: false },
});

export const BehaviorModel = model<StudentBehavior & Document>('Behavior', StudentBehavior);
