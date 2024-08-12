import { Document, model, Schema } from 'mongoose';

const StudentBehavior = new Schema({
  studentId: { type: Schema.Types.ObjectId, required: true },
  examinationId: { type: Schema.Types.ObjectId, required: true },
  behavior: { type: String, required: true },
  date: { type: Date, required: true },
  //comment: { type: String, required: false },
});

export const BehaviorModel = model<Document>('Behavior', StudentBehavior);
