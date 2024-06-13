import { Admin, Student, Teacher } from '@/interfaces/users.interface';
import { model, Schema, Document } from 'mongoose';

const UserSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'student', 'teacher'] },
    className: { type: String, required: true },
    department: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
const AdminSchema: Schema = new Schema(
  {
    ...UserSchema.obj,
  },
  { timestamps: true },
);
const StudentClassSchema: Schema = new Schema(
  {
    className: { type: String, required: true },
    department: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const StudentClassModel = model<Document & { classId: Schema.Types.ObjectId }>(
  'StudentClass',
  StudentClassSchema,
);
const StudentSchema: Schema = new Schema(
  {
    ...UserSchema.obj,
    classId: { type: Schema.Types.ObjectId, ref: 'StudentClass', required: true },
    schoolYear: { type: String, required: true },
  },
  { timestamps: true },
);
const TeacherSchema: Schema = new Schema(
  {
    ...UserSchema.obj,
  },
  { timestamps: true },
);

export const TeacherModel = model<Teacher & Document>('Teacher', TeacherSchema);

export const StudentModel = model<Student & Document>('Student', StudentSchema);

export const AdminModel = model<Admin & Document>('Admin', AdminSchema);

export const UserModel = model<Document & { userId: Schema.Types.ObjectId }>('User', UserSchema);
